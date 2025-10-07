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
    this.pokemonListContainer = document.getElementById("pokemon-list");

    // 버튼 DOM 요소들
    this.prevBtn = document.getElementById("prev-pokemon");
    this.nextBtn = document.getElementById("next-pokemon");
    this.prev100Btn = document.getElementById("prev-page");
    this.next100Btn = document.getElementById("next-page");
    this.randomBtn = document.getElementById("random-btn");
    this.searchBtn = document.getElementById("search-btn");
    this.searchInput = document.getElementById("search-input");
    this.searchSubmit = document.getElementById("search-submit");

    // 포켓몬 목록 네비게이션 버튼들
    this.prevListBtn = document.getElementById("prev-list-btn");
    this.nextListBtn = document.getElementById("next-list-btn");
    this.listPageInfo = document.getElementById("list-page-info");

    // 음악 관련 DOM 요소들
    this.video = document.getElementById("background-music");
    this.musicBtn = document.getElementById("music-btn");
    this.isMusicPlaying = false;

    // 초기화
    this.initializePokedex();
    this.initializeMusic(); // 음악 초기화 추가

    // 로딩 스피너 요소 추가
    this.imageLoadingSpinner = document.getElementById("image-loading-spinner");

    // 디바운스 관련 변수 (성능 최적화로 더 빠른 응답)
    this.searchDelay = 300; // 300ms 대기

    // 검색 캐시 (포켓몬 데이터와 한국어 이름 저장)
    this.pokemonCache = new Map();
    this.koreanNameCache = new Map();

    // 포켓몬 목록 페이지 관리
    this.currentListPage = 1;
    this.itemsPerPage = 10;
  }

  // 초기화 함수
  async initializePokedex() {
    await this.getTotalPokemon(); // 포켓몬 개수 가져오기
    this.setupEventListeners(); // 버튼 이벤트 설정
    this.setupImageLoadingEvent(); // 이미지 로딩 이벤트 설정
    this.loadPokemon(this.currentPokemonId); // 첫번째 포켓몬 로드
    this.createPokemonList(1, 10); // 포켓몬 목록 생성
    this.updateListPageInfo(); // 목록 페이지 정보 초기화
  }

  // 포켓몬 총 개수 가져오기
  async getTotalPokemon() {
    try {
      // count 값만 필요하므로 limit=1만 가지고 와서 성능 높이기
      const res = await fetch(`${API_URL}?limit=1`);
      const data = await res.json();
      this.totalPokemon = data.count;
    } catch (error) {
      console.error("포켓몬 개수 가져오기 실패:", error);
      this.totalPokemon = 151; // 에러 시 기본값
    }
  }

  // 포켓몬 목록 생성 (한국어 이름 지원)
  async createPokemonList(startId = 1, count = 10) {
    this.pokemonListContainer.innerHTML = "";

    for (let i = startId; i < startId + count && i <= this.totalPokemon; i++) {
      try {
        const response = await fetch(`${API_URL}/${i}`);
        const data = await response.json();

        // 한국어 이름 가져오기
        const koreanName = await this.getKoreanPokemonName(data);

        // 포켓몬 아이템 생성 (한국어 이름 포함)
        const pokemonItem = this.createPokemonListItem(data, i, koreanName);
        this.pokemonListContainer.appendChild(pokemonItem);

      } catch (err) {
        console.error(`포켓몬 ${i} 정보 가져오기 실패`, err);
      }
    }

  }

  // 버튼 이벤트 리스너 설정
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

    // 실시간 검색 (Lodash 디바운스 적용)
    const debouncedSearch = _.debounce(
      this.performSearch.bind(this),
      this.searchDelay
    );
    this.searchInput.addEventListener("input", debouncedSearch);

    // 포켓몬 목록 네비게이션 버튼
    this.prevListBtn.addEventListener("click", () => {
      this.goToPreviousListPage();
    });

    this.nextListBtn.addEventListener("click", () => {
      this.goToNextListPage();
    });

    // 사용법 가이드 관련 이벤트 리스너
    this.setupGuideEvents();
  }

  // 사용법 가이드 이벤트 설정
  setupGuideEvents() {
    // 이벤트 리스너가 필요한 요소들만 선택
    const guideToggle = document.getElementById("guide-toggle"); // ? 사용법 열기
    const guideModal = document.getElementById("guide-modal"); // 포켓몬 도감 사용법
    const guideClose = document.getElementById("guide-close"); // 포켓몬 도감 사용법 닫기
    const tabBtns = document.querySelectorAll(".tab-btn"); // 포켓몬 도감 사용법 탭
    const tabContents = document.querySelectorAll(".tab-content"); // 포켓몬 도감 사용법 탭 내용

    // 가이드 모달 열기
    guideToggle.addEventListener("click", () => {
      guideModal.classList.add("active");
    });

    // 가이드 모달 닫기
    guideClose.addEventListener("click", () => {
      guideModal.classList.remove("active");
    });

    // 모달 외부 클릭 시 닫기
    guideModal.addEventListener("click", (e) => {
      if (e.target === guideModal) {
        guideModal.classList.remove("active");
      }
    });

    // ESC 키로 모달 닫기(guideModal에 addEventListener을 붙이지 않은 이유)
    document.addEventListener("keydown", (e) => {
      // e.key는 눌린 키의 값
      if (e.key === "Escape" && guideModal.classList.contains("active")) {
        guideModal.classList.remove("active");
      }
    });

    // 탭 전환(사용법 모달 - 메뉴)
    tabBtns.forEach((btn) => {
      btn.addEventListener("click", () => {
        const targetTab = btn.getAttribute("data-tab"); // basic, search, tips

        // 모든 탭 비활성화(색상 변경)
        tabBtns.forEach((tab) => tab.classList.remove("active"));
        // 모든 콘텐츠 숨김(display: none)
        tabContents.forEach((content) => content.classList.remove("active"));

        // 선택된 탭 활성화
        btn.classList.add("active");
        document.getElementById(`${targetTab}-tab`).classList.add("active");

        // basic-tab, search-tab, tips-tab
      });
    });
  }

  // 포켓몬 로드 함수 (한국어 이름 지원)
  async loadPokemon(id) {
    try {

      // PokeAPI에서 포켓몬 정보 가져오기
      const res = await fetch(`${API_URL}/${id}`);
      const data = await res.json();

      if (!res.ok) {
        throw new Error("포켓몬 정보 가져오기 실패");
      }

      // 한국어 이름 가져오기
      const koreanName = await this.getKoreanPokemonName(data);

      // 포켓몬 정보 표시 (한국어 이름 포함)
      this.updatePokemonDisplay(data, koreanName);
    } catch (error) {
      console.error("포켓몬 로드 실패", error);
    }
  }

  // 한국어 포켓몬 이름 가져오기 함수 (캐시 활용)
  async getKoreanPokemonName(pokemonData) {
    try {
      // 캐시에서 먼저 확인
      if (this.koreanNameCache.has(pokemonData.id)) {
        const cachedName = this.koreanNameCache.get(pokemonData.id);
        return cachedName;
      }


      // species API에서 한국어 이름 가져오기
      const speciesRes = await fetch(pokemonData.species.url);
      const speciesData = await speciesRes.json();

      // 한국어 이름 찾기
      const koreanNameObj = speciesData.names.find(
        (n) => n.language.name === "ko"
      );

      // 한국어 이름이 있으면 반환, 없으면 영어 이름 반환
      const result = koreanNameObj ? koreanNameObj.name : pokemonData.name;

      // 캐시에 저장
      this.koreanNameCache.set(pokemonData.id, result);


      return result;
    } catch (error) {
      console.error("한국어 이름 가져오기 실패:", error);
      // 에러 발생 시 영어 이름 반환
      return pokemonData.name;
    }
  }

  updatePokemonDisplay(data, koreanName = null) {

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

    // 3. 포켓몬 이름 설정 (한국어 이름 우선 사용)
    this.pokemonName.textContent = koreanName || data.name;

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

  // 실시간 검색 함수 (디바운스 적용)
  async performSearch() {
    const searchWord = this.searchInput.value.trim().toLowerCase();

    // 검색어가 없으면 기본 목록 표시
    if (!searchWord) {
      this.hideSearchSpinner();
      this.resetToDefaultList();
      return;
    }

    try {

      // 검색 스피너 표시
      this.showSearchSpinner();

      // 숫자인지 확인
      const searchId = parseInt(searchWord);
      if (!isNaN(searchId) && searchId > 0 && searchId <= this.totalPokemon) {
        // ID로 검색
        await this.searchById(searchId);
        return;
      }

      // 이름으로 검색 (부분 검색 지원)
      await this.searchByName(searchWord);
    } catch (error) {
      console.error("검색 실패", error);
      this.hideSearchSpinner();
      this.showSearchError();
    }
  }

  // ID로 검색 (한국어 이름 지원)
  async searchById(searchId) {
    this.currentPokemonId = searchId;
    await this.loadPokemon(searchId);

    // 검색 결과를 목록에 표시
    this.hideSearchSpinner();
    this.pokemonListContainer.innerHTML = "";
    const response = await fetch(`${API_URL}/${searchId}`);
    const data = await response.json();

    // 한국어 이름 가져오기
    const koreanName = await this.getKoreanPokemonName(data);

    const pokemonItem = this.createPokemonListItem(data, searchId, koreanName);
    this.pokemonListContainer.appendChild(pokemonItem);
  }

  // 이름으로 검색 (부분 검색 지원, 한국어 이름 지원)
  async searchByName(searchWord) {
    try {
      // 먼저 영어 이름으로 정확한 검색 시도
      const response = await fetch(`${API_URL}/${searchWord.toLowerCase()}`);
      const data = await response.json();

      // 한국어 이름 가져오기
      const koreanName = await this.getKoreanPokemonName(data);

      // 검색 결과를 목록에 표시
      this.hideSearchSpinner();
      this.pokemonListContainer.innerHTML = "";
      const pokemonItem = this.createPokemonListItem(data, data.id, koreanName);
      this.pokemonListContainer.appendChild(pokemonItem);

      // 포켓몬 로드
      this.currentPokemonId = data.id;
      await this.loadPokemon(data.id);
    } catch (error) {
      // 영어 이름으로 정확한 검색이 실패하면 부분 검색 시도 (한국어 이름 포함)
      await this.searchByPartialName(searchWord);
    }
  }

  // 부분 검색 (한국어 이름 지원, 캐시 활용)
  async searchByPartialName(searchWord) {

    // 검색 범위를 50개로 제한 (성능 최적화)
    const searchRange = Math.min(50, this.totalPokemon);
    const matchingPokemon = [];

    // 배치 단위로 병렬 처리 (성능 최적화)
    const batchSize = 10; // 배치 크기

    for (
      let batchStart = 1;
      batchStart <= searchRange;
      batchStart += batchSize
    ) {
      const batchEnd = Math.min(batchStart + batchSize - 1, searchRange);
      const batchPromises = [];

      // 배치 내 포켓몬들을 병렬로 처리
      for (let i = batchStart; i <= batchEnd; i++) {
        batchPromises.push(this.searchSinglePokemon(i, searchWord));
      }

      try {
        const batchResults = await Promise.all(batchPromises);

        // 결과 처리
        for (const result of batchResults) {
          if (result) {
            matchingPokemon.push(result);

            // 5개 찾으면 조기 종료 (빠른 응답)
            if (matchingPokemon.length >= 5) {
              break;
            }
          }
        }

        // 충분한 결과를 찾았으면 더 이상 검색하지 않음
        if (matchingPokemon.length >= 5) {
          break;
        }
      } catch (error) {
        console.error(`배치 ${batchStart}-${batchEnd} 검색 실패:`, error);
      }
    }


    // 검색 스피너 숨기기
    this.hideSearchSpinner();

    // 검색 결과 표시
    this.pokemonListContainer.innerHTML = "";

    if (matchingPokemon.length > 0) {
      // 각 매칭된 포켓몬을 목록에 추가 (한국어 이름 이미 포함됨)
      for (const { data, id, koreanName } of matchingPokemon) {
        const pokemonItem = this.createPokemonListItem(data, id, koreanName);
        this.pokemonListContainer.appendChild(pokemonItem);
      }

      // 첫 번째 결과를 선택
      this.currentPokemonId = matchingPokemon[0].id;
      await this.loadPokemon(matchingPokemon[0].id);

    } else {
      this.showSearchError();
    }
  }

  // 단일 포켓몬 검색 (병렬 처리용)
  async searchSinglePokemon(id, searchWord) {
    try {
      // 캐시에서 먼저 확인
      let data;
      if (this.pokemonCache.has(id)) {
        data = this.pokemonCache.get(id);
      } else {
        const response = await fetch(`${API_URL}/${id}`);
        data = await response.json();
        // 캐시에 저장
        this.pokemonCache.set(id, data);
      }

      // 한국어 이름 가져오기 (캐시 활용)
      const koreanName = await this.getKoreanPokemonName(data);

      // 영어 이름 또는 한국어 이름에 검색어가 포함되는지 확인
      const englishMatch = data.name.toLowerCase().includes(searchWord);
      const koreanMatch = koreanName.toLowerCase().includes(searchWord);

      if (englishMatch || koreanMatch) {
        return { data, id, koreanName };
      }

      return null;
    } catch (error) {
      console.error(`포켓몬 ${id} 검색 실패:`, error);
      return null;
    }
  }

  // 기본 목록으로 복원
  resetToDefaultList() {
    this.currentListPage = 1;
    this.createPokemonList(1, 10);
    this.updateListPageInfo();
  }

  // 이전 목록 페이지로 이동
  goToPreviousListPage() {
    if (this.currentListPage > 1) {
      this.currentListPage--;
      const startId = (this.currentListPage - 1) * this.itemsPerPage + 1;
      this.createPokemonList(startId, this.itemsPerPage);
      this.updateListPageInfo();
    }
  }

  // 다음 목록 페이지로 이동
  goToNextListPage() {
    const maxPage = Math.ceil(this.totalPokemon / this.itemsPerPage);
    if (this.currentListPage < maxPage) {
      this.currentListPage++;
      const startId = (this.currentListPage - 1) * this.itemsPerPage + 1;
      this.createPokemonList(startId, this.itemsPerPage);
      this.updateListPageInfo();
    }
  }

  // 목록 페이지 정보 업데이트
  updateListPageInfo() {
    const startId = (this.currentListPage - 1) * this.itemsPerPage + 1;
    const endId = Math.min(startId + this.itemsPerPage - 1, this.totalPokemon);
    this.listPageInfo.textContent = `${startId}-${endId}`;

    // 버튼 활성화/비활성화
    this.prevListBtn.disabled = this.currentListPage === 1;
    this.nextListBtn.disabled =
      this.currentListPage >= Math.ceil(this.totalPokemon / this.itemsPerPage);
  }

  // 검색 스피너 표시
  showSearchSpinner() {
    this.pokemonListContainer.innerHTML = `
      <div class="search-spinner">
        <div class="spinner">
          <div></div>
          <div></div>
          <div></div>
        </div>
        <p>검색 중...</p>
      </div>
    `;
  }

  // 검색 스피너 숨기기
  hideSearchSpinner() {
    // 스피너가 있으면 제거
    const spinner = this.pokemonListContainer.querySelector(".search-spinner");
    if (spinner) {
      this.pokemonListContainer.innerHTML = "";
    }
  }

  // 검색 에러 표시
  showSearchError() {
    this.pokemonListContainer.innerHTML = `
      <div class="search-error">
        <p>포켓몬을 찾을 수 없습니다.</p>
        <p>다른 이름이나 번호를 입력해보세요.</p>
      </div>
    `;
  }

  // 포켓몬 아이템 생성 함수 (한국어 이름 지원)
  createPokemonListItem(data, id, koreanName = null) {
    const item = document.createElement("div");
    item.className = "pokemon-list-item";
    item.dataset.pokemonId = id;

    // 현재 선택된 포켓몬인지 확인
    if (id === this.currentPokemonId) {
      item.classList.add("active");
    }

    // 타입 정보 가져오기
    const types = data.types
      .map((type) => this.getKoreanTypeName(type.type.name))
      .join(", ");

    // 표시할 이름 결정 (한국어 이름 우선)
    const displayName = koreanName || data.name;

    // 내용 추가
    item.innerHTML = `
      <div class="pokemon-list-item-content">
        <img src="${data.sprites.front_default}" alt="${displayName}" 
             onerror="this.src='./src/assets/images/pokeball.png'">
        <div class="pokemon-list-item-info">
          <div class="pokemon-list-item-name">#${String(id).padStart(
            3,
            "0"
          )} ${displayName}</div>
          <div class="pokemon-list-item-types">${types}</div>
        </div>
      </div>
    `;

    // 클릭 이벤트 추가
    item.addEventListener("click", () => {
      this.selectPokemonFromList(id);
    });

    return item;
  }

  // 목록에서 포켓몬 선택
  selectPokemonFromList(id) {
    // 이전 선택 해제
    const activeItem = this.pokemonListContainer.querySelector(
      ".pokemon-list-item.active"
    );
    if (activeItem) {
      activeItem.classList.remove("active");
    }

    // 새 선택 표시
    const newActiveItem = this.pokemonListContainer.querySelector(
      `[data-pokemon-id="${id}"]`
    );
    if (newActiveItem) {
      newActiveItem.classList.add("active");
    }

    // 포켓몬 로드
    this.currentPokemonId = id;
    this.loadPokemon(id);
  }

  // 기존 검색 함수 (버튼 클릭용)
  async searchPokemon() {
    const searchWord = this.searchInput.value.trim();
    if (!searchWord) {
      alert("검색어를 입력해주세요");
      return;
    }
    await this.performSearch();
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
      // 음악 파일 로드 완료
    }); //readyState: 4가 나와야 비디오 재생 가능(0~4 값 존재)

    // 에러 처리
    this.video.addEventListener("error", (e) => {
      console.error("음악 파일 로드 실패:", e);
    });

    // 사용자 상호작용 감지 (브라우저 자동 재생 정책 우회)
    document.addEventListener(
      "click",
      () => {
        if (this.video.muted) {
          this.video.muted = false; // 음소거 해제
        }
      },
      {
        once: true,
      }
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

    this.video.muted = false; // 음소거 해제
    this.video.volume = 0.3; // 볼륨 재설정


    this.video
      .play()
      .then(() => {
        this.isMusicPlaying = true;
        this.musicBtn.classList.add("playing");
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
  }

  // ================== 이미지 로딩 기능 ==================

  // 이미지 로딩 시작
  showImageLoading() {
    this.imageLoadingSpinner.classList.remove("hidden");
    this.pokemonImage.classList.remove("loaded");
  }

  // 이미지 로딩 완료
  hiddenImageLoading() {
    this.imageLoadingSpinner.classList.add("hidden");
    this.pokemonImage.classList.add("loaded");
  }

  // 이미지 로딩 이벤트 설정
  setupImageLoadingEvent() {
    this.pokemonImage.addEventListener("load", () => {
      this.hiddenImageLoading();
    });

    this.pokemonImage.addEventListener("error", () => {
      this.hiddenImageLoading();
    });
  }
}

// <------- 클래스 끝 ------------>

// 페이지 로드 시 포켓몬 도감 초기화
document.addEventListener("DOMContentLoaded", () => {
  new PokemonDex();
});
