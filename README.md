# 🎮 포켓몬 도감 (Pokemon Pokedex)

레트로 게임보이 스타일의 포켓몬 도감 웹 애플리케이션입니다. PokeAPI를 활용하여 포켓몬 정보를 실시간으로 조회하고, 로딩 애니메이션과 배경음악 기능을 제공합니다.

// 포켓몬 데이터 가져오기
async function checkPokemonData() {
try {
const response = await fetch('https://pokeapi.co/api/v2/pokemon/1');
const data = await response.json();

    console.log('=== 포켓몬 데이터 구조 ===');
    console.log('전체 데이터:', data);
    console.log('사용 가능한 키들:', Object.keys(data));

    // 주요 속성들 자세히 보기
    console.log('=== 주요 속성들 ===');
    console.log('ID:', data.id);
    console.log('이름:', data.name);
    console.log('키:', data.height);
    console.log('몸무게:', data.weight);
    console.log('타입:', data.types);
    console.log('특성:', data.abilities);
    console.log('스프라이트:', data.sprites);

} catch (error) {
console.error('데이터 가져오기 실패:', error);
}
}

// 함수 실행
checkPokemonData();

## 🌟 주요 기능

### 📱 핵심 기능

- **포켓몬 정보 조회**: 1,000마리의 포켓몬 정보 실시간 조회
- **네비게이션**: 이전/다음/랜덤 포켓몬 이동
- **검색 기능**: ID 또는 이름으로 포켓몬 검색
- **타입 표시**: 포켓몬 타입을 한국어로 표시

### 🎨 UI/UX 기능

- **레트로 디자인**: 게임보이 스타일의 복고풍 인터페이스
- **로딩 애니메이션**: 이미지 로딩 중 스피너 표시
- **반응형 디자인**: 다양한 화면 크기에 대응

### 🎵 멀티미디어 기능

- **배경음악**: 플로팅 버튼으로 포켓몬 테마곡 재생/일시정지
- **GIF 이미지**: 고화질 포켓몬 GIF 이미지 표시 || GIF 이미지가 없을 경우 일반 이미지 표시
- **아이콘 변경**: 재생/일시정지 상태에 따른 아이콘 변경

## 🛠️ 기술 스택

### Frontend

- **HTML5**: 시맨틱 마크업
- **CSS3**: Flexbox, Grid, 애니메이션, 반응형 디자인
- **JavaScript (ES6+)**: 클래스, 비동기 프로그래밍, DOM 조작

### API & 외부 서비스

- **PokeAPI**: 포켓몬 데이터 제공
- **Project Pokemon**: 고화질 GIF 이미지
- **YouTube**: 배경음악 소스

### 개발 도구

- **yt-dlp**: YouTube 동영상 다운로드
- **ffprobe**: 미디어 파일 분석

## 📁 프로젝트 구조

```
2025-pokemon-dex/
├── index.html          # 메인 HTML 파일
├── styles.css          # 스타일시트
├── script.js           # JavaScript 로직
├── src/
│   ├── img/
│   │   └── pokeball.gif    # 음악 버튼 아이콘
│   └── pokemon-theme-audio.mp4  # 배경음악
└── README.md           # 프로젝트 문서
```

## 🚀 시작하기

### 1. 저장소 클론

```bash
git clone [repository-url]
cd 2025-pokemon-dex
```

### 2. 로컬 서버 실행

```bash
# Python 3
python -m http.server 8000

# Node.js
npx serve .

# 또는 VS Code Live Server 확장 사용
```

### 3. 브라우저에서 접속

```
http://localhost:8000
```

## 🔧 주요 구현 사항

### 클래스 기반 구조

```javascript
class Pokedex {
  constructor() {
    // 초기화
  }

  async loadPokemon(id) {
    // 포켓몬 데이터 로드
  }

  updatePokemonDisplay(data) {
    // 화면 업데이트
  }
}
```

### 비동기 API 처리

```javascript
async loadPokemon(id) {
  try {
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
    const data = await response.json();
    this.updatePokemonDisplay(data);
  } catch (error) {
    this.showError('포켓몬 정보를 가져올 수 없습니다.');
  }
}
```

### 이미지 로딩 관리

```javascript
showImageLoading() {
  this.imageLoadingSpinner.classList.remove("hidden");
  this.pokemonImage.classList.remove("loaded");
}

hideImageLoading() {
  this.imageLoadingSpinner.classList.add("hidden");
  this.pokemonImage.classList.add("loaded");
}
```

## 📊 API 데이터 구조 분석

### PokeAPI 기본 정보

- **API URL**: `https://pokeapi.co/api/v2/pokemon`
- **총 데이터 수**: 1,302개 (API이므로 추후 추가될 가능성 있음)
- **사용 가능한 키**: 20개

### 주요 데이터 키 설명

| 키                         | 설명                                             | 예시                  |
| -------------------------- | ------------------------------------------------ | --------------------- |
| `abilities`                | 포켓몬이 가질 수 있는 특성 목록                  | overgrow, chlorophyll |
| `base_experience`          | 배틀에서 쓰였을 때 주는 경험치 기본값            | 64                    |
| `cries`                    | 울음소리(cry) 관련 데이터 (최근 버전에 추가됨)   | -                     |
| `forms`                    | 같은 포켓몬의 다른 폼들 정보                     | 로토무 여러 형태      |
| `game_indices`             | 특정 게임 버전에서 쓰이는 포켓몬 번호들          | -                     |
| `height`                   | 키 (단위: decimetre = 0.1m)                      | 7 → 0.7m              |
| `held_items`               | 들고 있을 수 있는 아이템들 목록                  | -                     |
| `id`                       | 포켓몬의 고유 ID (= 전국 도감 번호와 거의 동일)  | 1                     |
| `is_default`               | 기본 폼인지 여부 (true/false)                    | true                  |
| `location_area_encounters` | 이 포켓몬을 야생에서 잡을 수 있는 장소 API URL   | -                     |
| `moves`                    | 배울 수 있는 기술 목록 (매우 길다)               | -                     |
| `name`                     | 포켓몬 이름 (영문)                               | bulbasaur             |
| `order`                    | 도감 순서와 비슷한 값                            | 1                     |
| `past_abilities`           | 예전 세대에서만 가졌던 특성들                    | -                     |
| `past_types`               | 예전 세대에서만 가졌던 타입들                    | -                     |
| `species`                  | 종(species) 정보 URL (진화 체인 등 확인 가능)    | -                     |
| `sprites`                  | ✅ 포켓몬 이미지(스프라이트) 모음                | -                     |
| `stats`                    | 능력치 정보 (HP, 공격, 방어, 특공, 특방, 스피드) | -                     |
| `types`                    | 타입 정보                                        | grass, poison         |
| `weight`                   | 몸무게 (단위: hectogram = 0.1kg)                 | 69 → 6.9kg            |

### 실제 사용하는 키 값

```javascript
// 주요 사용 데이터
const pokemonData = {
  id: data.id, // 도감 번호
  name: data.name, // 영어 이름
  height: data.height, // 키
  weight: data.weight, // 몸무게
  types: data.types, // 타입 배열
  abilities: data.abilities, // 특성 배열
  sprites: data.sprites.front_default, // 대표 이미지
  species: data.species.url, // 종(species) API URL
};
```

### 특성 데이터 처리

```javascript
// abilities 배열에서 is_hidden === false인 특성 하나만 선택
const mainAbility = pokemonData.abilities.find((ability) => !ability.is_hidden);
const abilityName = mainAbility.ability.name; // 내부 ability.name을 꺼내서 getKoreanAbility에 매핑
```

### 타입 데이터 처리

```javascript
// types 배열에서 type.name을 꺼내서 getKoreanType에 매핑
pokemonData.types.forEach((type) => {
  const typeName = type.type.name;
  const koreanType = getKoreanTypeName(typeName);
});
```

## 🎨 디자인 아이디어 및 참고사항

### 동료 아이디어 참고

#### 상민님 아이디어: GIF 이미지 활용

- **참고 아이디어**: GIF 포켓몬이미지 활용
- **기존**: 일반 이미지 사용
- **개선**: GIF 이미지로 변경하여 더 생동감 있는 표현
- **출처**: [Project Pokemon 3D Models](https://projectpokemon.org/home/docs/spriteindex_148/3d-models-generation-1-pokémon-r90/)

#### 명슬님 아이디어: 플로팅 버튼 음악 재생

- **참고 아이디어**: 애니메이션 배경음악 함께 재생
- **구현**: 플로팅 버튼으로 배경음악 재생/일시정지
- **기술**: yt-dlp 라이브러리로 MP4 다운로드 후 활용
- **문제점**:
  - 오디오 없이 다운로드됨
  - MP4 파일 GitHub 권장 용량(50MB) 초과
  - 축소 사이트에서 2번 용량 축소 후 사용 (음질 저하)

#### 여훈님, 맹슬님 아이디어: 로딩 애니메이션

- **애로사항**: GIF 로딩 시, 대기 시간 발생
- **참고 아이디어 및 구현 사항**: 이미지 로딩 중 스피너 애니메이션 추가
- **참고**: [CodePen 로딩 애니메이션](https://codepen.io/bassetts/pen/RqrPWG)
- **추가 적용사항**: (도서)UX/UI의 10가지 심리학 - 도허티 임계

### 음원 출처

- **곡명**: 포켓몬스터 1기 엔딩 - 우리는 모두 친구
- **게시자**: Winni 위니
- **링크**: [YouTube](https://www.youtube.com/watch?v=jzYgKjFvbvQ)

## 🔍 API 최대 ID 확인 스크립트

실제 접근 가능한 최대 포켓몬 ID를 확인하는 유틸리티 스크립트:

```javascript
async function findMaxPokemonId() {
  let maxId = 1;

  for (let i = 1; i <= 1500; i += 50) {
    // 50개씩 점프해서 빠르게 확인
    try {
      const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${i}`);
      if (res.ok) {
        maxId = i;
      } else {
        break; // 404가 나오면 그 이전이 최대값
      }
    } catch (error) {
      break;
    }
  }

  console.log("실제 접근 가능한 최대 ID:", maxId);
  return maxId;
}

findMaxPokemonId();
```

## 🐛 트러블 슈팅

### 1. JavaScript `this` 바인딩 문제

#### 문제 상황

```javascript
// ❌ 오류 발생
this.pokemonImage.onload = function () {
  this.hideImageLoading(); // TypeError: this.hideImageLoading is not a function
};
```

#### 원인 분석

- `function() {}` 내부에서 `this`는 호출 컨텍스트에 따라 달라짐
- `onload` 이벤트에서 `this`는 `img` 요소를 가리킴
- `img` 요소에는 `hideImageLoading` 메서드가 없어서 오류 발생

#### 해결 방법

```javascript
// ✅ 방법 1: bind() 사용 (권장)
this.pokemonImage.onload = function () {
  this.hideImageLoading(); // this가 Pokedex 클래스를 가리킴
}.bind(this);

// ✅ 방법 2: 화살표 함수 사용
this.pokemonImage.onload = () => {
  this.hideImageLoading(); // 자동으로 this 바인딩
};

// ✅ 방법 3: 변수로 this 저장
const self = this;
this.pokemonImage.onload = function () {
  self.hideImageLoading();
};
```

#### 학습 포인트

- **일반 함수**: `this`가 호출하는 객체에 따라 달라짐
- **화살표 함수**: `this`가 선언된 곳의 `this`를 유지
- **bind()**: `this`를 명시적으로 바인딩

### 2. 이미지 로딩 애니메이션 문제

#### 문제 상황

- 스피너와 이미지가 동시에 나타나고 사라짐
- 이미지 로딩 완료 후에도 스피너가 계속 표시됨

#### 원인 분석

```javascript
// ❌ 잘못된 로직
showImageLoading() {
  this.imageLoadingSpinner.classList.remove("hidden"); // 스피너 보이기
  this.pokemonImage.classList.add("loaded");           // 이미지도 보이기
}

hideImageLoading() {
  this.imageLoadingSpinner.classList.add("hidden");    // 스피너 숨기기
  this.pokemonImage.classList.remove("loaded");        // 이미지도 숨기기
}
```

#### 해결 방법

```javascript
// ✅ 올바른 로직
showImageLoading() {
  this.imageLoadingSpinner.classList.remove("hidden"); // 스피너 보이기
  this.pokemonImage.classList.remove("loaded");        // 이미지 숨기기
}

hideImageLoading() {
  this.imageLoadingSpinner.classList.add("hidden");    // 스피너 숨기기
  this.pokemonImage.classList.add("loaded");           // 이미지 보이기
}
```

#### 학습 포인트

- **CSS 클래스 동작**: `remove("hidden")` = 보이기, `add("hidden")` = 숨기기
- **로딩 상태 관리**: 로딩 시작 → 스피너만 표시, 로딩 완료 → 스피너 숨기고 이미지 표시

### 3. 함수명 오타 문제

#### 문제 상황

```javascript
// ❌ 함수명 오타
this.hideImageLoading(); // 함수가 존재하지 않음
```

#### 원인 분석

- 실제 함수명: `hiddenImageLoading()`
- 호출한 함수명: `hideImageLoading()`

#### 해결 방법

```javascript
// ✅ 올바른 함수명 사용
this.hiddenImageLoading();
```

#### 학습 포인트

- **함수명 일치**: 정의된 함수명과 호출하는 함수명이 정확히 일치해야 함
- **IDE 활용**: 자동완성 기능으로 오타 방지

### 4. MP4 음악 파일 문제

#### 문제 상황

- `yt-dlp`로 다운로드한 MP4 파일에서 소리가 나지 않음
- GitHub 파일 크기 제한(50MB) 초과

#### 원인 분석

```bash
# 파일 분석 결과
ffprobe music.mp4
# 오디오 스트림이 없음
```

#### 해결 방법

1. **오디오 포함된 파일 재다운로드**
2. **파일 크기 압축**: 온라인 도구로 용량 축소
3. **Git LFS 사용**: 대용량 파일 관리

#### 학습 포인트

- **미디어 파일 검증**: `ffprobe`로 파일 구조 확인
- **GitHub 제한**: 50MB 이상 파일은 Git LFS 사용 권장

### 5. 브라우저 자동 재생 정책 문제

#### 문제 상황

- 배경음악이 페이지 로드 시 자동으로 재생되지 않음
- 사용자가 버튼을 클릭해야만 음악이 재생됨

#### 원인 분석

**브라우저 자동 재생 정책**:

- 모든 주요 브라우저에서 자동 재생을 제한
- 웹 접근성과 사용자 경험을 위한 보호 기능
- 갑작스러운 소리 재생으로 인한 사용자 불편 방지

#### 브라우저별 정책

| 브라우저    | 정책                                       |
| ----------- | ------------------------------------------ |
| **Chrome**  | 음소거된 미디어만 자동 재생 허용           |
| **Firefox** | 더 엄격한 자동 재생 정책, 사용자 설정 필요 |
| **Safari**  | iOS에서 특히 엄격, 사용자 상호작용 필수    |
| **Edge**    | Chrome과 유사한 정책                       |

#### 해결 방법

```javascript
// ✅ 권장 방법: 사용자 상호작용 후 재생
document.addEventListener(
  "click",
  () => {
    video.muted = false; // 음소거 해제
  },
  { once: true }
);

// ✅ 음소거 상태로 자동 재생 (제한적)
video.muted = true;
video.play();
```

#### 웹 접근성 관점

**WCAG (Web Content Accessibility Guidelines) 준수**:

- **1.4.2 오디오 제어**: 자동 재생되는 오디오는 사용자가 중지할 수 있어야 함
- **2.1.1 키보드**: 모든 기능이 키보드로 접근 가능해야 함
- **2.2.2 일시정지**: 자동으로 시작되는 콘텐츠는 일시정지 가능해야 함

#### 현재 구현의 장점

```javascript
// 현재 프로젝트에서 사용한 방식
class Pokedex {
  initializeMusic() {
    this.video.muted = true; // 음소거 상태로 시작

    // 사용자 첫 클릭 시 음소거 해제
    document.addEventListener(
      "click",
      () => {
        this.video.muted = false;
        console.log("사용자 상호작용으로 음소거 해제됨");
      },
      { once: true }
    );
  }
}
```

**장점**:

1. **브라우저 정책 준수**: 자동 재생 정책을 위반하지 않음
2. **사용자 경험**: 사용자가 원할 때만 소리가 나도록 함
3. **접근성**: 모든 사용자를 배려하는 방식
4. **모든 브라우저 호환**: 크로스 브라우저 호환성 보장

#### 학습 포인트

- **브라우저 정책 이해**: 자동 재생 제한은 버그가 아닌 의도된 보호 기능
- **웹 접근성 중요성**: 모든 사용자를 배려하는 개발 방식
- **사용자 경험 최적화**: 갑작스러운 소리 재생 방지
- **크로스 브라우저 호환성**: 다양한 브라우저에서 일관된 동작 보장

### 6. CSS 선택자 충돌 문제

#### 문제 상황

```css
/* 두 개의 선택자가 같은 요소를 타겟팅 */
#pokemon-image {
  max-width: 100%;
  max-height: 100%;
}

.pokemon-image-container #pokemon-image {
  width: 55%;
  height: 100%;
}
```

#### 원인 분석

- CSS 우선순위: `.pokemon-image-container #pokemon-image` (110점) > `#pokemon-image` (100점)
- 더 구체적인 선택자가 우선 적용됨

#### 해결 방법

```css
/* ✅ 하나의 선택자로 통합 */
#pokemon-image {
  width: 55%;
  height: 100%;
  object-fit: contain;
  opacity: 0;
  transition: opacity 0.3s ease;
}
```

#### 학습 포인트

- **CSS 우선순위**: ID(100점) > Class(10점) > Element(1점)
- **선택자 구체성**: 더 구체적인 선택자가 우선 적용
- **코드 통합**: 중복 제거로 유지보수성 향상

## 📚 학습한 JavaScript 개념

### 1. 클래스 (Class)

```javascript
class Pokedex {
  constructor() {
    // 초기화
  }

  methodName() {
    // 메서드 정의
  }
}
```

### 2. 비동기 프로그래밍

```javascript
async functionName() {
  try {
    const response = await fetch(url);
    const data = await response.json();
  } catch (error) {
    // 에러 처리
  }
}
```

### 3. DOM 조작

```javascript
// 요소 선택
const element = document.getElementById("id");

// 클래스 조작
element.classList.add("class");
element.classList.remove("class");

// 내용 변경
element.textContent = "text";
element.innerHTML = "<span>HTML</span>";
```

### 4. 이벤트 리스너

```javascript
// 클릭 이벤트
element.addEventListener("click", () => {
  // 클릭 시 실행
});

// 이미지 로딩 이벤트
img.addEventListener("load", () => {
  // 이미지 로딩 완료 시 실행
});
```

### 5. this 바인딩

```javascript
// 일반 함수
function() {
  // this는 호출 컨텍스트에 따라 달라짐
}

// 화살표 함수
() => {
  // this는 선언된 곳의 this를 유지
}

// bind() 사용
function() {
  // this를 명시적으로 바인딩
}.bind(this)
```

## 🎯 향후 개선 계획

### 기능 개선

- [ ] 포켓몬 상세 정보 (키, 몸무게, 능력치)
- [ ] 진화 정보 표시
- [ ] 즐겨찾기 기능
- [ ] 다크모드 지원

### 성능 최적화

- [ ] 이미지 캐싱 구현
- [ ] API 응답 캐싱
- [ ] 코드 분할 (Code Splitting)

### 사용자 경험

- [ ] 키보드 단축키 지원
- [ ] 터치 제스처 지원
- [ ] 오프라인 모드

## 📄 라이선스

이 프로젝트는 MIT 라이선스 하에 배포됩니다.

## 🙏 감사의 말(활용 데이터)

- **PokeAPI**: 포켓몬 데이터
- **Project Pokemon**: 고화질 이미지
- **Winni 위니**: 포켓몬 테마곡

---

**개발자**: chDEV, 김채현
**최종 업데이트**: 2025년 8월
