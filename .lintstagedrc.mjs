export default {
  '*.{js,json,css,html,md}': (files) => [
    `biome check --write --no-errors-on-unmatched ${files.join(' ')}`
  ]
};
