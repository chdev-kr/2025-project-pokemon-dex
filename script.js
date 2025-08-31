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
    this.pokemonHeight = document.getElementById("pokemon-height");
    this.pokemonWeight = document.getElementById("pokemon-weight");
    this.pokemonAbility = document.getElementById("pokemon-ability");
    this.pokemonExperience = document.getElementById("pokemon-experience");

    // 버튼 DOM 요소들
    this.prevBtn = document.getElementById("prev-pokemon");
    this.nextBtn = document.getElementById("next-pokemon");
    this.prev100Btn = document.getElementById("prev-page");
    this.next100Btn = document.getElementById("next-page");
    this.randomBtn = document.getElementById("random-btn");
    this.searchBtn = document.getElementById("search-btn");
    this.searchInput = document.getElementById("search-input");
    this.searchSubmit = document.getElementById("search-submit");

    // 음악 관련 DOM 요소들
    this.video = document.getElementById("background-music");
    this.musicBtn = document.getElementById("music-btn");
    this.isMusicPlaying = false;

    // 초기화
    this.initializePokedex();
    this.initializeMusic(); // 음악 초기화 추가

    // 로딩 스피너 요소 추가
    this.imageLoadingSpinner = document.getElementById("image-loading-spinner");
  }

  // 초기화 함수
  async initializePokedex() {
    await this.getTotalPokemon(); // 포켓몬 개수 가져오기
    this.setupEventListeners(); // 버튼 이벤트 설정
    this.setupImageLoadingEvent(); // 이미지 로딩 이벤트 설정
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
    // 이전 포켓몬 버튼 ▼
    this.prevBtn.addEventListener("click", () => {
      if (this.currentPokemonId > 1) {
        this.currentPokemonId--;
        this.loadPokemon(this.currentPokemonId);
      }
    });

    // 다음 포켓몬 버튼 ▲
    this.nextBtn.addEventListener("click", () => {
      if (this.currentPokemonId < 1000) {
        this.currentPokemonId++;
        this.loadPokemon(this.currentPokemonId);
      }
    });

    // 100개 이전 포켓몬 버튼 ◀
    this.prev100Btn.addEventListener("click", () => {
      if (this.currentPokemonId > 100) {
        this.currentPokemonId = this.currentPokemonId - 100;
        this.loadPokemon(this.currentPokemonId);
      }
    });

    // 100개 다음 포켓몬 버튼 ▶
    this.next100Btn.addEventListener("click", () => {
      if (this.currentPokemonId < 901) {
        this.currentPokemonId += 100;
        this.loadPokemon(this.currentPokemonId);
      }
    });
    // 랜덤 버튼
    this.randomBtn.addEventListener("click", () => {
      // 정수 1~ 1000의 값 랜덤으로 가져오기
      this.currentPokemonId = Math.floor(Math.random() * 1000) + 1;
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
  async loadPokemon(id) {
    try {
      console.log(`${id}번 포켓몬 로드 중`);

      // PokeAPI에서 포켓몬 정보 가져오기
      const res = await fetch(`${API_URL}/${id}`);
      const data = await res.json();

      if (!res.ok) {
        throw new Error("포켓몬 정보 가져오기 실패");
      }
      console.log("포켓몬 정보 가져오기 성공", data);

      // 포캣몬 정보 표시
      this.updatePokemonDisplay(data);
    } catch (error) {
      console.error("포켓몬 로드 실패", error);
    }
  }

  updatePokemonDisplay(data) {
    console.log("=== 포켓몬 업데이트 시작 ===");
    console.log("포켓몬 데이터:", data);
    console.log("이미지 URL:", data.sprites.front_default);
    console.log(
      "현재 스피너 상태:",
      this.imageLoadingSpinner.classList.contains("hidden")
    );

    this.showImageLoading();

    // bind() 사용으로 this 바인딩
    this.pokemonImage.onload = function () {
      this.hiddenImageLoading();
    }.bind(this);

    this.pokemonImage.onerror = function (error) {
      this.hiddenImageLoading();
    }.bind(this);

    const timestamp = new Date().getTime();
    const imageUrl = `${data.sprites.front_default}?t=${timestamp}`;
    console.log("🔄 이미지 URL 설정:", imageUrl);

    this.pokemonImage.src = imageUrl;

    // 1. 포켓몬 이미지 설정(front_default가 기본 이미지, front_shiny 등 다양한 종류 있음)
    // this.pokemonImage.src = data.sprites.front_default;
    const gifUrl = `https://projectpokemon.org/images/normal-sprite/${data.name}.gif`;
    const apiUrl = data.sprites.front_default;

    // GIF가 있으면 사용, 없으면 API 이미지 사용
    this.pokemonImage.src = gifUrl;
    this.pokemonImage.onerror = () => {
      this.pokemonImage.src = apiUrl;
    };
    this.pokemonImage.alt = data.name;

    // 2. 포켓몬 번호 설정(padStart 메서드: 앞에 0을 붙여서 3자리로 만듦)
    this.pokemonNumber.textContent = `#${String(data.id).padStart(3, "0")}`;

    // 3. 포켓몬 이름 설정
    this.pokemonName.textContent = data.name;

    // 4. 포켓몬 타입 설정(타입 처리가 관건)
    this.updatePokemonTypes(data.types);
    // this.pokemonTypes.textContent = data.types;
    //   .map((type) => type.type.name)
    //   .join(", ");

    // 5. 포켓몬 키 설정
    this.pokemonHeight.textContent = `${data.height / 10}m`;

    // 6. 포켓몬 몸무게 설정
    this.pokemonWeight.textContent = `${data.weight / 10}kg`;

    // 7. 포켓몬 특성 설정
    this.updatePokemonAbility(data);

    // 8. 포켓몬 서식지 설정
    this.pokemonExperience.textContent = data.base_experience;
  }

  // ================== 검색 기능 ==================
  async searchPokemon() {
    const searchWord = this.searchInput.value.trim();
    if (!searchWord) {
      alert("검색어를 입력해주세요");
      return;
    }
    try {
      console.log(`${searchWord} 검색 중...`);
    } catch (error) {
      // 나중에 구현할 예정
      console.error("검색 실패", error);
    }
  }

  // 4-1. 타입 정보 업데이트
  updatePokemonTypes(types) {
    // 기존 타입 제거
    this.pokemonTypes.innerHTML = "";

    // 새로운 타입 추가
    types.forEach((pokemonType) => {
      const typeSpan = document.createElement("span");
      typeSpan.className = `type ${pokemonType.type.name}`;
      typeSpan.textContent = this.getKoreanTypeName(pokemonType.type.name);
      this.pokemonTypes.appendChild(typeSpan);
    });
  }

  // 특성 정보 업데이트
  updatePokemonAbility(data) {
    // data.abilities가 존재하고, 배열에 데이터가 있는지 확인
    if (data.abilities && data.abilities.length > 0) {
      // find(): 배열에서 조건에 맞는 첫 번째 요소를 찾는 함수
      // !ability.is_hidden은 is_hidden이 false인 요소를 찾는 조건
      const mainAbility = data.abilities.find((ability) => !ability.is_hidden);

      // 영어 특성 이름 가져온 후 -> 한국어로 변환 -> 화면에 표시
      if (mainAbility) {
        const koreanAbilityName = this.getKoreanAbilityName(
          mainAbility.ability.name
        );
        this.pokemonAbility.textContent = koreanAbilityName;
      } else {
        // 주요 특성이 없으면 첫 번째 특성 사용
        // 첫 번째 특성을 사용하되, 숨겨진 특성임을 표시
        const hiddenAbility = data.abilities[0];
        const koreanAbilityName = this.getKoreanAbilityName(
          hiddenAbility.ability.name
        );
        this.pokemonAbility.textContent = `${koreanAbilityName} (숨겨진 특성)`;
      }
    } else {
      this.pokemonAbility.textContent = "알 수 없음";
    }
  }

  // 4-2. 영어 타입명을 한국어로 변환 (새로 추가)
  getKoreanTypeName(englishType) {
    const typeMap = {
      normal: "노말",
      fire: "불꽃",
      water: "물",
      electric: "전기",
      grass: "풀",
      ice: "얼음",
      fighting: "격투",
      poison: "독",
      ground: "땅",
      flying: "비행",
      psychic: "에스퍼",
      bug: "벌레",
      rock: "바위",
      ghost: "고스트",
      dragon: "드래곤",
      dark: "악",
      steel: "강철",
      fairy: "페어리",
    };
    // 매핑 한국어 있으면 반환하고 아니면 영어 그대로 반환(OR 연산자)
    return typeMap[englishType] || englishType;
  }

  // 특성 이름을 한국어로 변환하는 함수
  getKoreanAbilityName(englishName) {
    const abilityMap = {
      // 일반 특성들
      overgrow: "심록",
      chlorophyll: "엽록소",
      blaze: "맹화",
      "solar-power": "선파워",
      torrent: "급류",
      "rain-dish": "습기",
      "shield-dust": "인분",
      "run-away": "도주",
      "shed-skin": "탈피",
      "compound-eyes": "복안",
      swarm: "벌레의알림",
      "keen-eye": "날카로운눈",
      "tangled-feet": "갈지자걸음",
      "big-pecks": "대담",
      pickup: "픽업",
      technician: "테크니션",
      limber: "유연",
      "cloud-nine": "날씨부정",
      "vital-spirit": "의기양양",
      "white-smoke": "하얀연기",
      pressure: "프레셔",
      "clear-body": "클리어바디",
      "natural-cure": "자연회복",
      "serene-grace": "하늘의은총",
      "swift-swim": "쓸쓸한가슴",
      "water-absorb": "저수",
      "volt-absorb": "전기흡수",
      "flash-fire": "타오르는불꽃",
      "shield-dust": "인분",
      "own-tempo": "마이페이스",
      sturdy: "옹골참",
      "early-bird": "일찍일어남",
      "flame-body": "불꽃몸",
      "magma-armor": "마그마의무장",
      "water-veil": "수의베일",
      "magnet-pull": "자석잡기",
      soundproof: "방음",
      "rain-dish": "습기",
      "sand-stream": "모래날림",
      pressure: "프레셔",
      "thick-fat": "두꺼운지방",
      "early-bird": "일찍일어남",
      "flame-body": "불꽃몸",
      "run-away": "도주",
      "keen-eye": "날카로운눈",
      "hyper-cutter": "괴력집게",
      pickup: "픽업",
      truant: "게으름",
      hustle: "의욕",
      "cute-charm": "헤롱헤롱",
      plus: "플러스",
      minus: "마이너스",
      forecast: "기분파",
      "sticky-hold": "점착",
      "shed-skin": "탈피",
      guts: "근성",
      "marvel-scale": "이상한비늘",
      "liquid-ooze": "해감액",
      overgrow: "심록",
      chlorophyll: "엽록소",
      "volt-absorb": "전기흡수",
      "lightning-rod": "피뢰침",
      "serene-grace": "하늘의은총",
      "swift-swim": "쓸쓸한가슴",
      chlorophyll: "엽록소",
      "early-bird": "일찍일어남",
      "flame-body": "불꽃몸",
      "run-away": "도주",
      "keen-eye": "날카로운눈",
      "hyper-cutter": "괴력집게",
      pickup: "픽업",
      truant: "게으름",
      hustle: "의욕",
      "cute-charm": "헤롱헤롱",
      plus: "플러스",
      minus: "마이너스",
      forecast: "기분파",
      "sticky-hold": "점착",
      "shed-skin": "탈피",
      guts: "근성",
      "marvel-scale": "이상한비늘",
      "liquid-ooze": "해감액",
      overgrow: "심록",
      chlorophyll: "엽록소",
      "volt-absorb": "전기흡수",
      "lightning-rod": "피뢰침",
      "serene-grace": "하늘의은총",
      "swift-swim": "쓸쓸한가슴",
      chlorophyll: "엽록소",
      "early-bird": "일찍일어남",
      "flame-body": "불꽃몸",
      "run-away": "도주",
      "keen-eye": "날카로운눈",
      "hyper-cutter": "괴력집게",
      pickup: "픽업",
      truant: "게으름",
      hustle: "의욕",
      "cute-charm": "헤롱헤롱",
      plus: "플러스",
      minus: "마이너스",
      forecast: "기분파",
      "sticky-hold": "점착",
      "shed-skin": "탈피",
      guts: "근성",
      "marvel-scale": "이상한비늘",
      "liquid-ooze": "해감액",
      levitate: "공중부양",
    };

    return abilityMap[englishName] || englishName; // 매핑이 없으면 영어 이름 반환
  }

  // ================== 음악 기능 ==================

  // 음악 초기화
  initializeMusic() {
    this.video.volume = 0.5; // 볼륨을 50%로 설정

    // 비디오 로드 완료 후 준비
    this.video.addEventListener("loadeddata", () => {
      console.log("음악 파일 로드 완료");
      console.log("비디오 준비 상태:", this.video.readyState);
    });

    // 에러 처리
    this.video.addEventListener("error", (e) => {
      console.error("음악 파일 로드 실패:", e);
    });

    // 사용자 상호작용 감지 (브라우저 자동 재생 정책 우회)
    document.addEventListener(
      "click",
      () => {
        if (this.video.muted) {
          this.video.muted = false;
          console.log("사용자 상호작용으로 음소거 해제됨");
        }
      },
      { once: true }
    );

    this.musicBtn.addEventListener("click", () => {
      this.toggleMusic();
    });
  }

  // 음악 토글 (재생/일시정지)
  toggleMusic() {
    if (this.isMusicPlaying) {
      this.stopMusic();
    } else {
      this.playMusic();
    }
  }

  // 음악 재생
  playMusic() {
    console.log("=== 음악 재생 시도 ===");
    console.log("재생 전 음소거 상태:", this.video.muted);
    console.log("재생 전 볼륨:", this.video.volume);
    console.log("재생 전 일시정지 상태:", this.video.paused);

    this.video.muted = false; // 음소거 해제
    this.video.volume = 0.3; // 볼륨 재설정

    console.log("음소거 해제 후 상태:", this.video.muted);
    console.log("볼륨 설정 후:", this.video.volume);

    this.video
      .play()
      .then(() => {
        console.log("음악 재생 시작 성공!");
        console.log("재생 후 일시정지 상태:", this.video.paused);
        console.log("재생 후 음소거 상태:", this.video.muted);
        console.log("재생 후 볼륨:", this.video.volume);

        this.isMusicPlaying = true;
        this.musicBtn.classList.add("playing");
        // CSS에서 자동으로 포켓볼 GIF 표시됨
      })
      .catch((error) => {
        console.error("음악 재생 실패:", error);
        console.error("에러 상세:", error.message);
        alert("음악 재생에 실패했습니다. 브라우저 설정을 확인해주세요.");
      });
  }

  // 음악 정지
  stopMusic() {
    this.video.pause();
    this.video.muted = true; // 음소거 처리
    this.isMusicPlaying = false;
    this.musicBtn.classList.remove("playing");
    // CSS에서 자동으로 ⏸️ 아이콘 표시됨

    console.log("음악 정지");
  }

  // ================== 이미지 로딩 기능 ==================

  // 이미지 로딩 시작
  showImageLoading() {
    console.log("이미지 로딩 시작");
    this.imageLoadingSpinner.classList.remove("hidden");
    this.pokemonImage.classList.remove("loaded");
  }

  // 이미지 로딩 완료
  hiddenImageLoading() {
    console.log("이미지 로딩 완료");
    this.imageLoadingSpinner.classList.add("hidden");
    this.pokemonImage.classList.add("loaded");
  }

  // 이미지 로딩 이벤트 설정
  setupImageLoadingEvent() {
    this.pokemonImage.addEventListener("load", () => {
      console.log("로딩 완료");
      this.hiddenImageLoading();
    });

    this.pokemonImage.addEventListener("error", () => {
      this.hiddenImageLoading();
      console.error("로딩 실패");
    });
  }
}

// <------- 클래스 끝 ------------>

// 페이지 로드 시 포켓몬 도감 초기화
document.addEventListener("DOMContentLoaded", () => {
  new PokemonDex();
});
