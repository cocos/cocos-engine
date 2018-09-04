export function isPow2(v) {
  return !(v & (v - 1)) && (!!v);
}