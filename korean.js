async function testKorean() {
  const res = await fetch(`https://pokeapi.co/api/v2/pokemon/1`);
  const detailData = await res.json();

  console.log(detailData);

  // species에서 한글 이름 가져오기
  const speciesRes = await fetch(detailData.species.url);
  const speciesData = await speciesRes.json();
  // const koreaNameObj = speciesData.names.find((n) => n.language.name === "ko");
  console.log(speciesData.names); //11가지 언어 존재
  // <<find() 메서드>> 배열에서 조건을 만족하는 첫 번째 요소를 찾아서 반환/조건을 만족하는 요소가 없으면 undefined 반환
  // n은 각 요소를 의미
  const koreaNameObj = speciesData.names.find((n) => n.language.name === "ko");
  console.log(koreaNameObj);

  const koreanName = koreaNameObj ? koreaNameObj.name : detailData.name;
  console.log(koreanName);

  // 타입, 키, 몸무게, 공격 등 상세정보
  const height = (detailData.height * 0.1).toFixed(1);
  const weight = (detailData.weight * 0.1).toFixed(1);

  const types = await Promise.all(
    detailData.types.map(async (a) => {
      const typeRes = await fetch(a.type.url);
      const typeData = await typeRes.json();
      const koNameObj = typeData.names.find((n) => n.language.name === "ko");
      return koNameObj ? koNameObj.name : a.type.name;
    })
  );
  console.log(types);

  console.log(detailData);
  const abilities = await Promise.all(
    detailData.abilities.map(async (a) => {
      const abRes = await fetch(a.ability.url);
      const abData = await abRes.json();
      const koNameObj = abData.names.find((n) => n.language.name === "ko");
      return koNameObj ? koNameObj.name : a.ability.name;
    })
  );
  console.log(abilities);

  const moves = await Promise.all(
    detailData.moves.slice(0, 5).map(async (m) => {
      const moveRes = await fetch(m.move.url);
      const moveData = await moveRes.json();
      const koNameObj = moveData.names.find((n) => n.language.name === "ko");
      return koNameObj ? koNameObj.name : m.move.name;
    })
  );
  console.log(moves);
  //   const abilities = await Promise.all(
  //     detailData.abilities.map(async (a) => {
  //       const abRes = await fetch(a.ability.url);
  //       const abData = await abRes.json();
  //       const koNameObj = abData.names.find((n) => n.language.name === "ko");
  //       return koNameObj ? koNameObj.name : a.ability.name;
  //     })
  //   );
  //   const moves = await Promise.all(
  //     detailData.moves.slice(0, 5).map(async (m) => {
  //       const moveRes = await fetch(m.move.url);
  //       const moveData = await moveRes.json();
  //       const koNameObj = moveData.names.find((n) => n.language.name === "ko");
  //       return koNameObj ? koNameObj.name : m.move.name;
  //     })
  //   );
  // }
}
testKorean();
