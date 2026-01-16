import { connectToRabbitMQ } from "../internal/pubsub/connection.js";
import { publishJSON } from "../internal/pubsub/publish.js";
import { ExchangePerilDirect, PauseKey } from "../internal/routing/routing.js";

async function main() {
  const conn = await connectToRabbitMQ("Peril game server");

  const publishCh = await conn.createConfirmChannel();
  try {
    await publishJSON(publishCh, ExchangePerilDirect, PauseKey, {
      isPaused: true,
    });
  } catch (err) {
    console.error("Error publishing message:", err);
  }
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
