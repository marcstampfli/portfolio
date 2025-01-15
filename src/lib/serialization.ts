/**
 * Type definitions for serializable data structures
 */
export type SerializablePrimitive = string | number | boolean | null;

export type SerializableComplex =
  | Date
  | Buffer
  | Map<SerializablePrimitive, Serializable>
  | Set<Serializable>;

export type Serializable =
  | SerializablePrimitive
  | SerializableComplex
  | Array<Serializable>
  | { [key: string]: Serializable | undefined };

/**
 * Serializes a complex object into a JSON-safe format
 * @param value - The value to serialize
 * @returns A JSON-safe serialized version of the input
 */
export function serializeObject(value: Serializable): Serializable {
  if (value === null || typeof value !== "object") {
    return value;
  }

  if (Array.isArray(value)) {
    return value.map(serializeObject);
  }

  if (value instanceof Date) {
    return value.toISOString();
  }

  if (value instanceof Buffer) {
    return {
      type: "Buffer",
      data: Array.from(value),
    };
  }

  if (value instanceof Map) {
    return {
      type: "Map",
      data: Array.from(value.entries()).map(([k, v]) => [
        k,
        serializeObject(v),
      ]),
    };
  }

  if (value instanceof Set) {
    return {
      type: "Set",
      data: Array.from(value).map(serializeObject),
    };
  }

  const result: Record<string, Serializable> = {};
  for (const [key, val] of Object.entries(value)) {
    if (val !== undefined && typeof val !== "function") {
      result[key] = serializeObject(val);
    }
  }

  return result;
}

/**
 * Deserializes a previously serialized object back to its original form
 * @param value - The serialized value to deserialize
 * @returns The deserialized object
 */
export function deserializeObject(value: Serializable): Serializable {
  if (value === null || typeof value !== "object") {
    return value;
  }

  if (Array.isArray(value)) {
    return value.map(deserializeObject);
  }

  if (typeof value === "object" && "type" in value) {
    switch (value.type) {
      case "Buffer":
        return Buffer.from(value.data as number[]);
      case "Map": {
        return new Map(
          (value.data as [SerializablePrimitive, Serializable][]).map(
            ([k, v]) => [k, deserializeObject(v)],
          ),
        );
      }
      case "Set":
        return new Set((value.data as Serializable[]).map(deserializeObject));
    }
  }

  const result: Record<string, Serializable> = {};
  for (const [key, val] of Object.entries(value)) {
    if (val !== undefined) {
      result[key] = deserializeObject(val);
    }
  }

  return result;
}
