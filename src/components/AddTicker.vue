<template>
  <section>
    <div class="flex">
      <div class="max-w-xs">
        <label for="wallet" class="block text-sm font-medium text-gray-700"
          >Тикер</label
        >
        <div class="mt-1 relative rounded-md shadow-md">
          <input
            v-model="ticker"
            type="text"
            name="wallet"
            id="wallet"
            class="
              block
              w-full
              pr-10
              border-gray-300
              text-gray-900
              focus:outline-none focus:ring-gray-500 focus:border-gray-500
              sm:text-sm
              rounded-md
            "
            placeholder="Например DOGE"
            @keydown.enter="addTicker"
            @input="errorClear"
            @keydown.left="errorClear"
            @keydown.right="errorClear"
          />
        </div>
        <div
          v-if="ticker && filtredCoinsList.length"
          class="flex bg-white shadow-md p-1 rounded-md shadow-md flex-wrap"
        >
          <span
            v-for="coin in filtredCoinsList"
            :key="coin"
            class="
              inline-flex
              items-center
              px-2
              m-1
              rounded-md
              text-xs
              font-medium
              bg-gray-300
              text-gray-800
              cursor-pointer
            "
            @click="addTickerByPromt(coin)"
          >
            {{ coin }}
          </span>
        </div>
        <div v-if="error" class="text-sm text-red-600">
          Такой тикер уже добавлен
        </div>
      </div>
    </div>
    <add-button class="my-4" :disabled="disabled" @click="addTicker" />
  </section>
</template>
<script>
import AddButton from "./AddButton.vue";
export default {
  components: {
    AddButton
  },

  props: {
    disabled: {
      type: Boolean,
      default: false
    },
    error: {
      type: Boolean,
      default: false
    },
    coins: {
      type: Array,
      default() {
        return [];
      }
    }
  },

  emits: {
    "add-ticker": (value) => typeof value === "string",
    "error-clear": null
  },

  data() {
    return {
      ticker: ""
    };
  },

  computed: {
    filtredCoinsList() {
      return this.coins
        .filter((el) => el.includes(this.upperCaseTiker))
        .slice(0, 4);
    },

    upperCaseTiker() {
      return this.ticker.toUpperCase();
    }
  },

  methods: {
    addTicker() {
      if (!this.ticker.length === 0) {
        return
      }

      this.$emit("add-ticker", this.upperCaseTiker);
      // TODO: при ошибке не должен очищаться
      this.ticker = "";
    },

    addTickerByPromt(coin) {
      this.ticker = coin;
      this.addTicker();
    },

    errorClear() {
      this.$emit('error-clear')
    }
  }
};
</script>
