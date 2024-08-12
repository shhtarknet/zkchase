/* Autogenerated file. Do not edit manually. */

import { defineComponent, Type as RecsType, World } from "@dojoengine/recs";

export type ContractComponents = Awaited<
  ReturnType<typeof defineContractComponents>
>;

export function defineContractComponents(world: World) {
  return {
    Chaser: (() => {
      return defineComponent(
        world,
        {
          player_id: RecsType.BigInt,
          game_id: RecsType.Number,
          position: RecsType.Number,
          alive: RecsType.Boolean,
          invincible: RecsType.Boolean,
          kill_count: RecsType.Number,
          treasury_count: RecsType.Number,
        },
        {
          metadata: {
            name: "zkchase-Chaser",
            types: ["felt252", "u32", "u8", "bool", "bool", "u32", "u32"],
            customTypes: [],
          },
        },
      );
    })(),
    Game: (() => {
      return defineComponent(
        world,
        {
          id: RecsType.Number,
          map_id: RecsType.Number,
          treasury: RecsType.Number,
          chasers: RecsType.BigInt,
          seed: RecsType.BigInt,
        },
        {
          metadata: {
            name: "zkchase-Game",
            types: ["u32", "u8", "u8", "felt252", "felt252"],
            customTypes: [],
          },
        },
      );
    })(),
    Player: (() => {
      return defineComponent(
        world,
        {
          id: RecsType.BigInt,
          game_id: RecsType.Number,
          name: RecsType.BigInt,
        },
        {
          metadata: {
            name: "zkchase-Player",
            types: ["felt252", "u32", "felt252"],
            customTypes: [],
          },
        },
      );
    })(),
  };
}
