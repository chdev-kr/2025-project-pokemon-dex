const API_URL = "https://pokeapi.co/api/v2/pokemon";

// 포켓몬 도감 클래스
class PokemonDex {
  constructor() {
    // 현재 포켓몬 ID
    this.currentPokemonId = 1;

    // 포켓몬 총 개수
    this.totalPokemon = 0;

    // DOM 요소들 가져오기
    this.pokemonImage = document.getElementById("pokemon-image");
    this.pokemonNumber = document.getElementById("pokemon-number");
    this.pokemonName = document.getElementById("pokemon-name");
    this.pokemonTypes = document.getElementById("pokemon-types");

    // 버튼 DOM 요소들
    this.prevBtn = document.getElementById("prev-pokemon");
    this.nextBtn = document.getElementById("next-pokemon");
    this.randomBtn = document.getElementById("random-btn");
    this.searchBtn = document.getElementById("search-btn");
    this.searchInput = document.getElementById("search-input");
    this.searchSubmit = document.getElementById("search-submit");

    // 초기화
    this.initializePokedex();
  }

  // 초기화 함수
  async initializePokedex() {
    await this.getTotalPokemon(); // 포켓몬 개수 가져오기
    this.setupEventListeners(); // 버튼 이벤트 설정
    this.loadPokemon(this.currentPokemonId); // 첫번째 포켓몬 로드
  }

  // 포켓몬 총 개수 가져오기
  async getTotalPokemon() {
    try {
      // count 값만 필요하므로 limit=1만 가지고 와서 성능 높이기
      const res = await fetch(`${API_URL}?limit=1`);
      const data = await res.json();
      this.totalPokemon = data.count;
      console.log(`총 포켓몬 개수: ${this.totalPokemon}`);
    } catch (error) {
      console.error("포켓몬 개수 가져오기 실패:", error);
      this.totalPokemon = 151; // 에러 시 기본값
    }
  }

  // 이벤트 리스너 설정
  setupEventListeners() {
    // 이전 포켓몬 버튼
    this.prevBtn.addEventListener("click", () => {
      if (this.currentPokemonId > 1) {
        this.currentPokemonId--;
        this.loadPokemon(this.currentPokemonId);
      }
    });

    // 다음 포켓몬 버튼
    this.nextBtn.addEventListener("click", () => {
      if (this.currentPokemonId < this.totalPokemon) {
        this.currentPokemonId++;
        this.loadPokemon(this.currentPokemonId);
      }
    });

    // 랜덤 버튼
    this.randomBtn.addEventListener("click", () => {
      this.currentPokemonId = Math.floor(Math.random() * this.totalPokemon) + 1;
      this.loadPokemon(this.currentPokemonId);
    });

    // 검색 버튼
    this.searchSubmit.addEventListener("click", () => {
      this.searchPokemon();
    });

    // 엔터키로 검색
    this.searchInput.addEventListener("keypress", (e) => {
      if (e.key === "Enter") {
        this.searchPokemon();
      }
    });
  }

  // 포켓몬 로드 함수 (아직 안 만듦)
  loadPokemon(id) {
    console.log(`${id}번 포켓몬 로드!`);
    // 나중에 구현할 예정
  }

  // 검색 함수 (아직 안 만듦)
  searchPokemon() {
    console.log("검색 기능!");
    // 나중에 구현할 예정
  }
}

// <------- 클래스 끝 ------------>

// 페이지 로드 시 포켓몬 도감 초기화
document.addEventListener("DOMContentLoaded", () => {
  new PokemonDex();
});
