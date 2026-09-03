import {
  pomodoroCreate,
  pomodoroDelete,
  pomodoroHistoryCreate,
  pomodoroHistoryList,
  pomodoroList,
  pomodoroUpdate,
  type CreatePomodoroHistoryRequestDto,
  type PomodoroConfigurationRequestDto,
  type PomodoroConfigurationResponseDto,
  type PomodoroHistoryListData,
  type PomodoroHistoryResponseDto,
} from "@/api";

function authorizationHeaders(accessToken: string) {
  return { Authorization: `Bearer ${accessToken}` };
}

function requireData<T>(value: T | undefined): T {
  if (value === undefined) throw new Error("API response has no data");
  return value;
}

export async function listPomodoroConfigurations(
  accessToken: string,
): Promise<PomodoroConfigurationResponseDto[]> {
  const response = await pomodoroList({
    headers: authorizationHeaders(accessToken),
    throwOnError: true,
  });
  return requireData(response.data.data);
}

export async function createPomodoroConfiguration(
  accessToken: string,
  body: PomodoroConfigurationRequestDto,
): Promise<PomodoroConfigurationResponseDto> {
  const response = await pomodoroCreate({
    body,
    headers: authorizationHeaders(accessToken),
    throwOnError: true,
  });
  return requireData(response.data.data);
}

export async function updatePomodoroConfiguration(
  accessToken: string,
  id: string,
  body: PomodoroConfigurationRequestDto,
): Promise<PomodoroConfigurationResponseDto> {
  const response = await pomodoroUpdate({
    body,
    headers: authorizationHeaders(accessToken),
    path: { id },
    throwOnError: true,
  });
  return requireData(response.data.data);
}

export async function deletePomodoroConfiguration(
  accessToken: string,
  id: string,
): Promise<void> {
  await pomodoroDelete({
    headers: authorizationHeaders(accessToken),
    path: { id },
    throwOnError: true,
  });
}

export async function createPomodoroHistory(
  accessToken: string,
  body: CreatePomodoroHistoryRequestDto,
): Promise<PomodoroHistoryResponseDto> {
  const response = await pomodoroHistoryCreate({
    body,
    headers: authorizationHeaders(accessToken),
    throwOnError: true,
  });
  return requireData(response.data.data);
}

export async function listPomodoroHistory(
  accessToken: string,
  query?: PomodoroHistoryListData["query"],
): Promise<{ items: PomodoroHistoryResponseDto[] }> {
  const response = await pomodoroHistoryList({
    headers: authorizationHeaders(accessToken),
    query,
    throwOnError: true,
  });
  return requireData(response.data.data);
}
