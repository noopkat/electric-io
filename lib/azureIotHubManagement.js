const { Connection, generate_uuid } = require("rhea-promise");
const {
  IotHubConnectionConfig,
  IotSharedKeyCredential,
  Constants,
  CbsClient,
  TokenType,
  translate
} = require("@azure/core-amqp");

/**
 * Get the connection string of the Event Hub-compatible endpoint using the management interface on the IoT Hub.
 */
async function getEventHubConnectionString(iotHubConnectionString) {
  const config = IotHubConnectionConfig.create(iotHubConnectionString);

  // Create connection:
  const connectionOptions = {
    transport: "tls",
    host: config.hostName,
    hostname: config.hostName,
    username: config.sharedAccessKeyName,
    port: 5671,
    reconnect: false
  };

  const connection = new Connection(connectionOptions);
  const cbsClient = new CbsClient(connection, generate_uuid());

  try {
    await authenticate(config, cbsClient);

    const linkRedirect = await getLinkRedirect(connection);

    const connectionString = buildConnectionString(config, linkRedirect);

    return connectionString;
  } catch (err) {
    console.error(
      "Electric-IO could not connect to Azure IoT Hub management interface."
    );
    if (err.message) {
      console.error(err.message);
    }
    return null;
  } finally {
    await cbsClient.close();
    await connection.close();
  }
}

/**
 * Authenticate using AMQP Claims-based Security using the credentials in the IoT Hub connection string.
 */
async function authenticate(config, cbsClient) {
  const resourceUri = `sb://${config.hostName}/messages/events/$management`;
  const credential = new IotSharedKeyCredential(
    config.sharedAccessKeyName,
    config.sharedAccessKey
  );
  const accessToken = credential.getToken(resourceUri);

  await cbsClient.init();
  const response = await cbsClient.negotiateClaim(
    resourceUri,
    accessToken,
    TokenType.CbsTokenTypeSas
  );

  if (response.statusCode !== 200) {
    throw new Error(
      "Authentication was not successful. Please check your connection string."
    );
  }
}

/**
 * Send a fire-and-forget message to the management endpoint to cause an AMQP link redirect error, which is returned.
 */
async function getLinkRedirect(connection) {
  const senderOptions = {
    name: `The cutest IoT dashboard of your dreams (${generate_uuid()})`,
    target: {
      address: "/messages/events/$management"
    }
  };

  let sender;
  try {
    sender = await connection.createAwaitableSender(senderOptions);

    const message = {
      body: Buffer.from("[]"),
      message_id: generate_uuid(),
      reply_to: generate_uuid(),
      application_properties: {
        operation: Constants.readOperation
      }
    };
    await sender.send(message);
  } catch (err) {
    const amqpErr = translate(err);
    if (
      amqpErr &&
      amqpErr.name === "MessagingError" &&
      amqpErr.code === "LinkRedirectError"
    ) {
      return amqpErr;
    }
    throw err;
  } finally {
    if (sender) {
      sender.close();
    }
  }
}

/**
 * Build the connection string of the Event Hub-compatible endpoint from the AMQP link redirect error details and
 * the credentials in the IoT Hub connection string.
 */
function buildConnectionString(config, linkRedirectError) {
  const uri = new URL(linkRedirectError.info.address);
  const uriPath = uri.pathname.split("/");
  const endpoint = `sb://${uri.hostname}/`;
  const entityPath = uriPath[1];
  return `Endpoint=${endpoint};EntityPath=${entityPath};SharedAccessKeyName=${config.sharedAccessKeyName};SharedAccessKey=${config.sharedAccessKey}`;
}

module.exports = {
  getEventHubConnectionString
};
