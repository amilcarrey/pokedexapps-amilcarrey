import type { APIRoute } from "astro"
import { addPokemon, findPokemonById, findPokemonByName, getPokemonList } from "../../../services/pokemon"
import { invalidInput, nameTooLong, nameTooShort, pokemonAlreadyExists } from "../../../helpers/errors"

export const GET: APIRoute = async (context) => {
  const page = parseInt(context.url.searchParams.get('page') ?? '1', 10)

  return new Response(JSON.stringify(await getPokemonList(page)), {
    headers: {
      'content-type': 'application/json',
      'Access-Control-Allow-Origin': '*',
    }
  })
}

export const POST: APIRoute = async (context) => {
  const pokemon = await context.request.json()
  const {name, id} = pokemon

  if (!id || !name) {
    return handleError(invalidInput, { id, name })
  }

  if (name.length > 30) {
    return handleError(nameTooLong, { id, name })
  }

  if (name.length < 3) {
    return handleError(nameTooShort, { id, name })
  }

  if (await findPokemonById(id) || await findPokemonByName(name)) {
    return handleError(pokemonAlreadyExists, { id, name })
  }

  await addPokemon(pokemon)

  return new Response(JSON.stringify(pokemon), {
    status:400,
    headers: {
      'content-type': 'application/json',
      'Access-Control-Allow-Origin': '*',
    }
  })
}

function handleError(invalidInput: any, arg1: { id: any; name: void }): Response | PromiseLike<Response> {
  return new Response(JSON.stringify({error: invalidInput}), {headers: {
      'content-type': 'application/json',
      'Access-Control-Allow-Origin': '*', 
    }})
}
