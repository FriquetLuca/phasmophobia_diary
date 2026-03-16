export function urlPrefix(src: string) {
  if (__APP_MODE__ === 'build') {
    return `/phasmophobia_diary${src}`;
  }
  return src;
}