import axios from 'axios'
import { defineStore } from 'pinia'

export const usePokemonStore = defineStore('pokemon', {
  state: () => ({
    pokemons: [],
    loading: false,
    error: null,
  }),

  actions: {
    async getPokemons() {
      this.loading = true
      this.error = null
      try {
        const response = await axios.get('https://pokeapi.co/api/v2/pokemon?limit=10000')

        this.pokemons = response.data.results

        return this.pokemons
      } catch (err) {
        this.error = err.message
      } finally {
        this.loading = false
      }
    },

    async getTypes() {
      this.loading = true
      this.error = null
      try {
        const response = await axios.get('https://pokeapi.co/api/v2/type/?limit=21')

        return response.data
      } catch (err) {
        this.error = err.message
      } finally {
        this.loading = false
      }
    },

    async getPokemonByID(id) {
      this.loading = true
      this.error = null
      try {
        const response = await axios.get(`https://pokeapi.co/api/v2/pokemon/${id}`)

        return response
      } catch (err) {
        this.error = err.message
      } finally {
        this.loading = false
      }
    },
  },
})
