import { client } from "@/api/generated/client.gen";
import { configureApiClient } from "./config";

configureApiClient(client);

export { client, configureApiClient };
