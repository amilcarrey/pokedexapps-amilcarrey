import Datastore from "nedb-promises";
import type { Pokemon } from "./pokemon";

const db = Datastore.create({ filename: "./data/db", autoload: true });

const savePokemon = async (pokemon: Pokemon) => {
   return db.insert(pokemon);
}

const findPokemon = async (id: number) => {
   return db.findOne({ id });
}

const findPokemonByName = async (name: string) => {
   return db.findOne({ name });
}  

const getPokemonList = async (page: number = 1) => {
   const count = await db.count({});
   const list = await db.find({}).skip((page - 1) * 5).limit(5);
   return { list, count };
}

const removePokemon = async (id: number) => {
   return await db.remove({ id }, {});
}

export { savePokemon, findPokemon, findPokemonByName, getPokemonList };