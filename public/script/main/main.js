
window.addEventListener("load", () => {
    setTimeout(() => {
        const loading = document.getElementById("loading");
        if (loading) loading.style.display = "none";
      }, 1000); 


    const loadingScreen = document.getElementById("loading-screen");
    const logo = document.getElementById("club_logo");
  
    // 로고 애니메이션 (로딩 시작 시 로고가 나타나도록)
    const logoAnimation = logo.animate(
      [
        { opacity: 0, transform: "scale(0.8)" },
        { opacity: 1, transform: "scale(1)" },
      ],
      {
        duration: 1500,
        easing: "ease",
        fill: "forwards",
      }
    );
  
    // 로딩 화면 스크린 동작
    const loadingScreenAnimation = loadingScreen.animate(
      [
        { transform: "translateY(100vh)", opacity: 1 },
        { transform: "translateY(0)", opacity: 0 },
      ],
      {
        duration: 2000,
        delay: 1200,
        easing: "ease",
        fill: "forwards",
      }
    );
  
    loadingScreenAnimation.onfinish = () => {
      document.getElementById("loading").style.display = "none";
    };
    
})  

const result = ["member","like", "review"]
const filterBtn = document.querySelectorAll('.category-btn');
const clubList = document.querySelector('.club-list')

for (let i = 0; i < filterBtn.length; i++) {
  filterBtn[i].onclick = async () => {
    try {
     const filterData = await axios.get(`/filter?index=${result[i]}`)
     console.log("filterdata" , filterData)
     const clubs = filterData.data.data;
    console.log("clubs",clubs )
     clubList.innerHTML = '';

     if (clubs.length === 0) {
       clubList.innerHTML = '조회된 동호회가 없습니다';
       return;
     }

     clubs.forEach(club => {
       const clubItem = document.createElement('div');
       clubItem.classList.add('club-item');
       clubItem.innerHTML = `
         <img src="${club.image || '/images/default.png'}" alt="동호회 이미지" class="club-image" style="width: 100px; height: 100px; object-fit: cover;">
         <h3>${club.name || '이름 없음'}</h3>
         <p>${club.introduction || '설명이 없습니다.'}</p>
       `;
  
       clubList.appendChild(clubItem);
     });
   } catch (error) {
     console.log('필터링 중 오류 발생:', error);
   }
 };
}


const mapContainer = document.getElementById('map'); // 지도 컨테이너
const defaultLat = 37.5443765; // 기본 위도
const defaultLng = 127.1276202; // 기본 경도
var polygons = []; // 지도에 그린 폴리곤을 저장할 배열
var currentZoomLevel = 4; // 기본 줌 레벨

// 지도 옵션 설정 (초기 위치 및 줌 레벨)
const mapOptions = {
    center: new kakao.maps.LatLng(defaultLat, defaultLng), // 기본 중심
    level: currentZoomLevel // 초기 줌 레벨
};

// 지도 객체 생성
const map = new kakao.maps.Map(mapContainer, mapOptions);

// 위치 정보 가져오기
if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(position) {
        // 줌 레벨이 변경될 때마다 지역 단위 또는 광역 단위 데이터를 로드
        kakao.maps.event.addListener(map, 'zoom_changed', function () {
            const zoomLevel = map.getLevel();
            const zoomLabel = document.getElementById('zoomLabel'); // 줌 레벨 표시

            if (zoomLevel <= 9) {
                zoomLabel.textContent = '지역단위';
                loadGeoJSONData('/api/area', '지역단위'); 
            } else {
                zoomLabel.textContent = '광역단위';
                loadGeoJSONData('/api/widearea', '광역단위');
            }
        });

        // 현재 위치를 기반으로 지도 중심을 이동
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        const currentLoc = new kakao.maps.LatLng(lat, lng);
        map.setCenter(currentLoc); // 지도의 중심을 현재 위치로 설정

    }, function(error) {
        console.log("위치 정보를 가져올 수 없습니다. 기본 위치를 사용합니다.", error);
    });
} else {
    alert("이 브라우저는 위치 정보를 지원하지 않습니다.");
}

function loadGeoJSONData(url, type) {
  fetch(url)
    .then(response => response.json())
    .then(geoJsonData => {
      clearPolygons();

      if (type === '지역단위') {
          geoJsonData.features = geoJsonData.features.filter(feature => {
              const name = feature.properties && feature.properties.SIG_KOR_NM;
              return name && (name.includes('시') || name.includes('군') || name.includes('구'));
          });
      }

      geoJsonData.features.forEach(function(feature) {
          const geometry = feature.geometry;
          if (geometry.type === "Polygon") {
              drawPolygon(geometry.coordinates, type);
          } else if (geometry.type === "MultiPolygon") {
              geometry.coordinates.forEach(function(polygonCoords) {
                  drawPolygon(polygonCoords, type);
              });
          }
      });
    })
    .catch(error => console.error("GeoJSON 데이터를 불러오는 데 실패했습니다.", error));
}


// 기존에 그린 폴리곤을 모두 제거하는 함수
function clearPolygons() {
    polygons.forEach(function(polygon) {
        polygon.setMap(null); // 지도에서 폴리곤 제거
    });
    polygons = []; // 폴리곤 배열 초기화
}

// 폴리곤을 지도에 그리는 함수
function drawPolygon(coords, type) {
    // 삼항 연산자로 지역단위일 경우 파란색, 광역단위일 경우 빨간색
    const color = type === '지역단위' ? '#007AFF' : '#FF3B30';

    // 각 폴리곤의 좌표를 KakaoMap LatLng 객체로 변환하여 경로 설정
    coords.forEach(function(ring) {
        const path = ring.map(function(coord) {
            return new kakao.maps.LatLng(coord[1], coord[0]); // [lat, lng] 순서
        });

        // 폴리곤 객체 생성 및 지도에 그리기
        const polygon = new kakao.maps.Polygon({
            map: map,
            path: path,
            strokeWeight: 2, 
            strokeColor: color,
            strokeOpacity: 0.8,
            fillColor: color, 
            fillOpacity: 0.5 
        });

        polygons.push(polygon);
    });
}
