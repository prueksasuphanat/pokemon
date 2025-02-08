<script setup>
import { usePokemonStore } from '@/stores/pokemon'
import { computed, onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import CustomInput from './CustomInput.vue'

const route = useRoute() // แก้ไขตัวแปรจาก rounte เป็น route
const router = useRouter() // ใช้ useRouter() แทนที่การใช้ router ใน template

const pokemonStore = usePokemonStore()
const pokemons = ref([])
const selectedPokemon = ref({})
const selectedPokemonID = ref(route.params.id)

const nextPokemon = ref({})
const prevPokemon = ref({})

const search = ref('')

const filteredPokemons = computed(() => {
  return pokemons.value.filter((pokemon) =>
    pokemon.name.toLowerCase().includes(search.value.toLowerCase()),
  )
})

const types = ref([
  { name: 'normal', url: 'https://pokeapi.co/api/v2/type/1/' },
  { name: 'fighting', url: 'https://pokeapi.co/api/v2/type/2/' },
  { name: 'flying', url: 'https://pokeapi.co/api/v2/type/3/' },
  { name: 'poison', url: 'https://pokeapi.co/api/v2/type/4/' },
  { name: 'ground', url: 'https://pokeapi.co/api/v2/type/5/' },
  { name: 'rock', url: 'https://pokeapi.co/api/v2/type/6/' },
  { name: 'bug', url: 'https://pokeapi.co/api/v2/type/7/' },
  { name: 'ghost', url: 'https://pokeapi.co/api/v2/type/8/' },
  { name: 'steel', url: 'https://pokeapi.co/api/v2/type/9/' },
  { name: 'fire', url: 'https://pokeapi.co/api/v2/type/10/' },
  { name: 'water', url: 'https://pokeapi.co/api/v2/type/11/' },
  { name: 'grass', url: 'https://pokeapi.co/api/v2/type/12/' },
  { name: 'electric', url: 'https://pokeapi.co/api/v2/type/13/' },
  { name: 'psychic', url: 'https://pokeapi.co/api/v2/type/14/' },
  { name: 'ice', url: 'https://pokeapi.co/api/v2/type/15/' },
  { name: 'dragon', url: 'https://pokeapi.co/api/v2/type/16/' },
  { name: 'dark', url: 'https://pokeapi.co/api/v2/type/17/' },
  { name: 'fairy', url: 'https://pokeapi.co/api/v2/type/18/' },
  { name: 'stellar', url: 'https://pokeapi.co/api/v2/type/19/' },
  { name: 'unknown', url: 'https://pokeapi.co/api/v2/type/10001/' },
  { name: 'shadow', url: 'https://pokeapi.co/api/v2/type/10002/' },
])

const getPokemons = async () => {
  try {
    pokemons.value = await pokemonStore.getPokemons()
  } catch (error) {
    console.error('Error fetching pokemons:', error)
  }
}

const getPokemonById = async (id) => {
  try {
    selectedPokemon.value = await pokemonStore.getPokemonByID(id)

    nextPokemon.value = await pokemonStore.getPokemonByID(Number(id) + 1)

    prevPokemon.value = await pokemonStore.getPokemonByID(Number(id) - 1)
    if (!prevPokemon.value || prevPokemon.value.data === null) {
      prevPokemon.value = ''
    }
  } catch (error) {
    console.error(`Error fetching Pokémon with ID ${id}:`, error)
  }
}

const getIDByUrl = (url) => {
  return url.split('/')[url.split('/').length - 2]
}

onMounted(() => {
  getPokemonById(selectedPokemonID.value)
  getPokemons()
})

watch(
  () => route.params.id,
  (newId) => {
    selectedPokemonID.value = newId
    getPokemonById(newId)
  },
)
</script>

<template>
  <div class="">
    <div
      class="bg-white p-4 flex flex-row justify-between items-center"
      v-if="selectedPokemon.data"
    >
      <!-- prev -->
      <div
        v-if="prevPokemon.data"
        class="pl-4 flex flex-col items-start cursor-pointer"
        @click="
          router.push(`/${Number(selectedPokemonID) > 1 ? Number(selectedPokemonID) - 1 : 1}`)
        "
      >
        <p class="text-center w-[75px]">{{ prevPokemon.data.name }}</p>
        <div
          class="cursor-pointer h-[50px] w-[50px] flex items-center justify-center bg-gray-200 hover:bg-gray-300 rounded-full"
        >
          <span class="text-2xl font-bold text-gray-700">&lt;</span>
        </div>
      </div>
      <div v-else class="pl-4 flex flex-col items-start">
        <p class="text-center w-[75px]"></p>
        <div class="h-[50px] w-[50px] flex items-center justify-center bg-gray-200 rounded-full">
          <span class="text-2xl font-bold text-white">&lt;</span>
        </div>
      </div>

      <div class="flex flex-col items-center justify-center w-full position-relative">
        <p class="text-[30px] font-bold text-gray-700 mt-3 uppercase">
          {{ selectedPokemon.data.species.name }}
        </p>

        <div
          class="lg:grid lg:grid-cols-2 gap-4 pt-4 pb-4 items-center justify-center sm:grid md:grid-cols-1"
        >
          <img
            class="w-[200px] object-contain"
            :src="`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/home/${selectedPokemonID}.png`"
          />

          <div class="flex flex-row gap-2">
            Type :
            <div v-for="(type, index) in selectedPokemon.data.types" :key="index" class="">
              <div v-for="(item, index) in types" :key="index" class="">
                <button
                  v-if="item.url === type.type.url"
                  :class="'cursor-pointer type-icon ' + 'type-' + item.name"
                >
                  {{ item.name }}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- next -->

      <div
        v-if="nextPokemon.data"
        class="pr-4 flex flex-col items-end cursor-pointer"
        @click="router.push(`/${Number(selectedPokemonID) + 1}`)"
      >
        <p class="w-[75px]">{{ nextPokemon.data.name }}</p>

        <div
          class="cursor-pointer h-[50px] w-[50px] flex items-center justify-center bg-gray-200 hover:bg-gray-300 rounded-full"
        >
          <span class="text-2xl font-bold text-gray-700">&gt;</span>
        </div>
      </div>
    </div>
  </div>

  <!-- All pokemons -->
  <div class="p-4 bg-white">
    <CustomInput v-model="search" label="" placeholder="Search filter.."></CustomInput>
  </div>
  <div class="flex flex-wrap justify-center gap-2 p-4 h-screen overflow-y-scroll">
    <div
      @click="router.push(`/${getIDByUrl(pokemon.url)}`)"
      v-for="(pokemon, index) in filteredPokemons"
      :key="index"
      class="w-[200px] bg-white shadow-lg rounded-lg p-6 flex flex-col items-center transition-transform transform hover:scale-105 cursor-pointer h-[200px]"
    >
      <img
        :alt="pokemon.name"
        :src="`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/home/${getIDByUrl(pokemon.url)}.png`"
        class="w-24 h-24 object-contain"
      />
      <p class="text-lg font-semibold text-gray-700 mt-3">{{ pokemon.name }}</p>
    </div>
  </div>
</template>

<style scoped>
.type-icon {
  display: inline-block;
  width: 66px;
  margin-bottom: 4px;
  background: #dbdbdb;
  border: 1px solid #a3a3a3;
  border-radius: 4px;
  border: 1px solid rgba(0, 0, 0, 0.2);
  color: #fff;
  font-size: 0.75rem;
  font-weight: normal;
  line-height: 1.5rem;
  text-align: center;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.7);
  text-transform: uppercase;
  transition: opacity 0.4s;
}

.type-normal {
  background-color: #aa9;
}

.type-fighting {
  background-color: #b54;
}

.type-flying {
  background-color: #89f;
}

.type-poison {
  background-color: #a59;
}

.type-ground {
  background-color: #db5;
}

.type-rock {
  background-color: #ba6;
}

.type-bug {
  background-color: #ab2;
}

.type-ghost {
  background-color: #66b;
}

.type-steel {
  background-color: #aab;
}

.type-fire {
  background-color: #f42;
}

.type-water {
  background-color: #39f;
}

.type-grass {
  background-color: #7c5;
}

.type-electric {
  background-color: #fc3;
}

.type-psychic {
  background-color: #f59;
}

.type-ice {
  background-color: #6cf;
}

.type-dragon {
  background-color: #76e;
}

.type-dark {
  background-color: #754;
}

.type-fairy {
  background-color: #e9e;
}

.type-stellar {
  background-color: #fff;
}

.type-shadow {
  background-color: #000;
}

.type-unknown {
  background-color: #aaa;
}
</style>
