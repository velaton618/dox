import { Api } from "telegram";
import * as cfg from "./config";
import { Telegram } from "./helpers/telegram.helper";
import { IConfig } from "./models/IConfig";
import { NewMessageEvent } from "telegram/events";
import { shared } from "./shared";
import * as keywords from "./keywords";

export async function check_block(telegram: Telegram, config: IConfig) {
  try {
    await telegram.client.sendMessage(config.target, { message: "Жив?" });
  } catch (e: any) {
    if (e.errorMessage === "YOU_BLOCKED_USER") {
      await telegram.client.invoke(new Api.contacts.Unblock({ id: config.target }));

      await telegram.client.sendMessage(config.target, { message: "UNBLOCKED ENTER" });
    } else {
      console.error(e);
    }
  }
}

export async function handle_update(event: NewMessageEvent) {
  if (!event.isPrivate) return;

  if (shared.waiting_message) {
    if (shared.waiting_message.target.includes("@")) {
      switch (shared.waiting_message.target) {
        case "@all":
          if (!event.message.text) return;
          break;
        case "@num":
          if (!keywords.KEYWORDS["@num"].test(event.message.text)) return;
          break;
        case "@yes":
          if (!keywords.KEYWORDS["@yes"].test(event.message.text)) return;
          break;
        case "@no":
          if (!keywords.KEYWORDS["@no"].test(event.message.text)) return;
          break;
        default:
          return;
      }

      await event.message.reply({ message: shared.waiting_message.reply });

      if (shared.waiting_message.wait_message) {
        shared.waiting_message = shared.waiting_message.wait_message;
        shared.time_since_last_message = 0;
      } else {
        shared.waiting_message = undefined;
      }
    } else {
      if (event.message.text === shared.waiting_message.target) {
        await event.message.reply({ message: shared.waiting_message.reply });

        if (shared.waiting_message.wait_message) {
          shared.waiting_message = shared.waiting_message.wait_message;
          shared.time_since_last_message = 0;
        } else {
          shared.waiting_message = undefined;
        }
      }
    }
  }
}

export async function START(telegram: Telegram, config: IConfig) {
  while (true) {
    try {
      if (shared.waiting_message) {
        if (shared.waiting_message.timeout
          && shared.time_since_last_message
          && (shared.time_since_last_message >= shared.waiting_message.timeout)) {
          shared.waiting_message = undefined;
          shared.time_since_last_message = 0;
        }

        shared.time_since_last_message = shared.time_since_last_message + 1;
        await new Promise((resolve) => setTimeout(resolve, 1 * 1000));

        continue;
      }

      const message = config.messages.find((message) => message.id === shared.last_message + 1);
      if (!message) { shared.last_message = 0; continue; }

      await telegram.client.sendMessage(config.target, { message: message.text });

      if (message.wait_message) { shared.waiting_message = message.wait_message; shared.time_since_last_message = 0; }
      shared.last_message = message.id;

      await new Promise((resolve) => setTimeout(resolve, message.delay * 1000));
    } catch (e: any) {
      console.error(e);
    }
  }
}
