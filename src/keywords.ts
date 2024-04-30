export enum Keywords {
  Str = '@str',
  Num = '@num',
  Yes = '@yes',
  No = '@no',
}

export const KEYWORDS = {
  "@num": /^[0-9]+$/,
  "@yes": /^(yes|да|true|1)$/i,
  "@no": /^(no|не|false|0)$/i,
};