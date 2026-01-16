import amqp from "amqplib";

const DEFAULT_RABBIT_CONN_STRING = "amqp://guest:guest@localhost:5672/";

/**
 * Connects to RabbitMQ and sets up graceful shutdown handlers
 * @param serviceName - Name of the service (for logging purposes)
 * @param connString - RabbitMQ connection string (defaults to localhost)
 * @returns The RabbitMQ connection
 */
export async function connectToRabbitMQ(
  serviceName: string,
  connString: string = DEFAULT_RABBIT_CONN_STRING,
): Promise<Awaited<ReturnType<typeof amqp.connect>>> {
  const conn = await amqp.connect(connString);
  console.log(`${serviceName} connected to RabbitMQ!`);

  ["SIGINT", "SIGTERM"].forEach((signal) =>
    process.on(signal, async () => {
      try {
        await conn.close();
        console.log("RabbitMQ connection closed.");
      } catch (err) {
        console.error("Error closing RabbitMQ connection:", err);
      } finally {
        process.exit(0);
      }
    }),
  );

  return conn;
}
