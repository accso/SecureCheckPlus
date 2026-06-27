import { createAvatar } from '@dicebear/core'
import * as botttsNeutral from '@dicebear/bottts-neutral'

export function getAvatarDataUri(seed: string, size: number = 128): string {
  return createAvatar(botttsNeutral, { seed, size }).toDataUri()
}
