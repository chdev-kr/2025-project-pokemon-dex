# 2025-project-pokemon-dex

##https://pokeapi.co/

### https://pokeapi.co/api/v2/pokemon

## 사용할 Key

1. api 확인하기
2. 총 데이터 수: count(1302개) -> API이므로 추후 추가될 가능성 있음
3. key 값(20개)
   ['abilities', 'base_experience', 'cries', 'forms', 'game_indices', 'height', 'held_items', 'id', 'is_default', 'location_area_encounters', 'moves', 'name', 'order', 'past_abilities', 'past_types', 'species', 'sprites', 'stats', 'types', 'weight']

• abilities → 포켓몬이 가질 수 있는 특성 목록 (예: overgrow, chlorophyll)

- 숨겨진 속성과 기본 속성 2가지 있는 is_hidden: true/false
  • base_experience → 배틀에서 쓰였을 때 주는 경험치 기본값
  • cries → 울음소리(cry) 관련 데이터 (최근 버전에 추가됨)
  • forms → 같은 포켓몬의 다른 폼들 정보 (예: 로토무 여러 형태)
  • game_indices → 특정 게임 버전에서 쓰이는 포켓몬 번호들
  • height → 키 (단위: decimetre = 0.1m, 예: 7 → 0.7m)
  • held_items → 들고 있을 수 있는 아이템들 목록
  • id → 포켓몬의 고유 ID (= 전국 도감 번호와 거의 동일)
  • is_default → 기본 폼인지 여부 (true/false)
  • location_area_encounters → 이 포켓몬을 야생에서 잡을 수 있는 장소 API URL
  • moves → 배울 수 있는 기술 목록 (매우 길다)
  • name → 포켓몬 이름 (영문)
  • order → 도감 순서와 비슷한 값
  • past_abilities → 예전 세대에서만 가졌던 특성들
  • past_types → 예전 세대에서만 가졌던 타입들
  • species → 종(species) 정보 URL (진화 체인 등 확인 가능)
  • sprites → ✅ 포켓몬 이미지(스프라이트) 모음
  • stats → 능력치 정보 (HP, 공격, 방어, 특공, 특방, 스피드)
  • types → 타입 정보 (예: grass, poison)
  • weight → 몸무게 (단위: hectogram = 0.1kg, 예: 69 → 6.9kg)

4. 사용할 key 값:
   • id → 도감 번호 (pokemonData.id)
   • name → 영어 이름 (pokemonData.name)
   • height → 키 (pokemonData.height)
   • weight → 몸무게 (pokemonData.weight)
   • types → 타입 배열 (pokemonData.types)
   • 내부 type.name을 꺼내서 getKoreanType에 매핑
   • abilities → 특성 배열 (pokemonData.abilities)

   - 그중 is_hidden === false인 특성 하나만 선택
   - 내부 ability.name을 꺼내서 getKoreanAbility에 매핑
     • sprites.front_default → 대표 이미지 (pokemonData.sprites.front_default)
     • species.url → 종(species) API URL (pokemonData.species.url)

5. 속성값 -> 한글로 하드코딩하여 사용(AI 시키기)

1차 중간 공유

1. HTML, CSS 구조 완성
2. API 구조 파악 및 사용 키 값 분류
3. 영어 속성값 -> 한국어로 하드코딩(AI)활용 하여 한국어 매핑 후 사용 예정
   스크린샷 2025-08-29 오후 3.08.40.png
