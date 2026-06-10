import { ProjectsQueryParamsInterface } from '../../api/interfaces';

const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const CADASTRAL_CODE_PATTERN = /^[\d.]+$/;

/**
 * Maps a free-text keyword onto the matching projects query param:
 * UUIDs become projectId, digit/dot sequences become cadastralCode,
 * anything else is treated as a project name.
 */
export function applyKeywordToParams(
  keyword: string,
  params: ProjectsQueryParamsInterface,
): void {
  const value = keyword.trim();
  if (!value) return;

  if (UUID_PATTERN.test(value)) {
    params.projectId = value;
  } else if (CADASTRAL_CODE_PATTERN.test(value)) {
    params.cadastralCode = value;
  } else {
    params.projectName = value;
  }
}
