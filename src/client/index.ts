import { connectToRabbitMQ } from "../internal/pubsub/connection.js";
import { clientWelcome } from "../internal/gamelogic/gamelogic.js";
import { declareAndBind, SimpleQueueType } from "../internal/pubsub/consume.js";
import { ExchangePerilDirect, PauseKey } from "../internal/routing/routing.js";

async function main() {
  console.log("Starting Peril client...");
  const conn = await connectToRabbitMQ("Peril client");

  const username = await clientWelcome();
  
  const queueName = `${PauseKey}.${username}`;
  await declareAndBind(
    conn,
    ExchangePerilDirect,
    queueName,
    PauseKey,
    SimpleQueueType.Transient,
  );
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
