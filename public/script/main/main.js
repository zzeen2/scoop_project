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

const result = ["member", "like", "review", "star"];
const filterBtn = document.querySelectorAll('.category-btn');
const clubList = document.querySelector('.club-list');

for (let i = 0; i < filterBtn.length; i++) {
  filterBtn[i].onclick = async () => {
    try {
      const filterData = await axios.get(`/filter?index=${result[i]}`);
      const clubs = filterData.data.data;
      console.log(clubs)
      clubList.innerHTML = '';

      if (clubs.length === 0) {
        clubList.innerHTML = '조회된 동호회가 없습니다';
        return;
      }

      clubs.forEach(club => {
        const clubItem = document.createElement('div');
        clubItem.classList.add('club-item');

        // 공통 출력 정보
        let extraInfo = '';
        if (result[i] === 'member') {
          extraInfo = `<p>회원 수 : ${club.MemberCount || 0}</p>`;
        } else if (result[i] === 'like') {
          extraInfo = `<p>좋아요 : ${club.HeartCount || 0}</p>`;
        } else if (result[i] === 'review') {
          extraInfo = `<p>조회수 : ${club.view_count || 0}</p>`;
        } else if (result[i] === 'star') {
          extraInfo = `<p>평점 : ${club.ReviewCount || '0.0'}</p>`;
        }

        clubItem.innerHTML = `
          <img src="${club.image || '/images/default.png'}" alt="동호회 이미지" class="club-image" style="width: 100px; height: 100px; object-fit: cover;">
          <h3>${club.name || '이름 없음'}</h3>
          <p>${club.introduction || '설명이 없습니다.'}</p>
          ${extraInfo}
        `;

        clubList.appendChild(clubItem);
      });
    } catch (error) {
      console.log('필터링 중 오류 발생:', error);
    }
  };
}



let MIN_ZOOM_LEVEL = 4;
let MAX_ZOOM_LEVEL = 7;
let currentViewType = '지역단위';
let userLocation = null;

const mapContainer = document.getElementById('map');
const defaultLat = 37.5443765;
const defaultLng = 127.1276202;
let polygons = [];
const currentZoomLevel = 4;
let stationMarkers = [];

const mapOptions = {
    center: new kakao.maps.LatLng(defaultLat, defaultLng),
    level: currentZoomLevel,
    draggable: true
};

function setDraggable(draggable) {
    map.setDraggable(draggable);    
}

const map = new kakao.maps.Map(mapContainer, mapOptions);


if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(position) {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        const currentLoc = new kakao.maps.LatLng(lat, lng);
        
        userLocation = currentLoc; // 위치 저장

        map.setCenter(currentLoc);

        const imageSrc = '/public/images/usericon.png';
        const imageSize = new kakao.maps.Size(40, 40);
        const imageOption = { offset: new kakao.maps.Point(20, 40) };
        const markerImage = new kakao.maps.MarkerImage(imageSrc, imageSize, imageOption);

        const marker = new kakao.maps.Marker({
            position: currentLoc,
            map: map,
            title: "현재 위치",
            image: markerImage
        });

        loadStationMarkers(); // 초기 로드시 지하철 마커 표시
    }, function(error) {
        console.log("위치 정보를 가져올 수 없습니다. 기본 위치를 사용합니다.", error);
    });
} else {
    alert("이 브라우저는 위치 정보를 지원하지 않습니다.");
}
// 광역단위 버튼
const wideAreaButton = document.createElement('button');
wideAreaButton.textContent = '광역단위 동호회';
wideAreaButton.style.position = 'absolute';
wideAreaButton.style.top = '10px';
wideAreaButton.style.right = '10px';
wideAreaButton.style.zIndex = 1000;
wideAreaButton.style.padding = '10px 20px';
wideAreaButton.style.backgroundColor = '#FF3B30';
wideAreaButton.style.color = 'white';
wideAreaButton.style.border = 'none';
wideAreaButton.style.borderRadius = '5px';
wideAreaButton.style.cursor = 'pointer';
mapContainer.appendChild(wideAreaButton);

// 지역단위 버튼
const regionAreaButton = document.createElement('button');
regionAreaButton.textContent = '지역단위 동호회';
regionAreaButton.style.position = 'absolute';
regionAreaButton.style.top = '50px';
regionAreaButton.style.right = '10px';
regionAreaButton.style.zIndex = 1000;
regionAreaButton.style.padding = '10px 20px';
regionAreaButton.style.backgroundColor = '#007AFF';
regionAreaButton.style.color = 'white';
regionAreaButton.style.border = 'none';
regionAreaButton.style.borderRadius = '5px';
regionAreaButton.style.cursor = 'pointer';
mapContainer.appendChild(regionAreaButton);

// 현재 위치로 이동 버튼
const currentLocationButton = document.createElement('button');
currentLocationButton.textContent = '현재 위치로 이동';
currentLocationButton.style.position = 'absolute';
currentLocationButton.style.top = '90px';
currentLocationButton.style.right = '10px';
currentLocationButton.style.zIndex = 1000;
currentLocationButton.style.padding = '10px 20px';
currentLocationButton.style.backgroundColor = '#34C759';
currentLocationButton.style.color = 'white';
currentLocationButton.style.border = 'none';
currentLocationButton.style.borderRadius = '5px';
currentLocationButton.style.cursor = 'pointer';
mapContainer.appendChild(currentLocationButton);

// 버튼 클릭 시 사용자 위치로 이동
currentLocationButton.addEventListener('click', function () {
    if (userLocation) {
        map.setCenter(userLocation);
    } else {
        alert('위치 정보가 아직 준비되지 않았습니다.');
    }
});



// 지역단위 클릭 이벤트
regionAreaButton.addEventListener('click', function () {
    map.setLevel(4); // 지역단위로 확대
    MIN_ZOOM_LEVEL = 2;
    MAX_ZOOM_LEVEL = 6;
    currentViewType = '지역단위';

    zoomLabel.textContent = '지역단위';
    clearPolygons(); // 기존 폴리곤 삭제
    clearStationMarkers(); // 기존 마커 삭제
    clearClubList(); // 동호회 목록 초기화
    loadStationMarkers(); // 지하철역 마커 로드
});

// 광역단위 클릭 이벤트
wideAreaButton.addEventListener('click', function () {
    map.setLevel(9); // 광역단위로 확대
    MIN_ZOOM_LEVEL = 9;
    MAX_ZOOM_LEVEL = 13;
    currentViewType = '광역단위';

    zoomLabel.textContent = '광역단위';
    clearPolygons(); // 기존 폴리곤 삭제
    clearStationMarkers(); // 기존 마커 삭제
    clearClubList(); // 동호회 목록 초기화
    loadAreaPoligon('/api/area'); // 시/군구 폴리곤 로드
});

kakao.maps.event.addListener(map, 'zoom_changed', function () {
    const currentZoom = map.getLevel();
    if (currentZoom < MIN_ZOOM_LEVEL) {
        map.setLevel(MIN_ZOOM_LEVEL);
    } else if (currentZoom > MAX_ZOOM_LEVEL) {
        map.setLevel(MAX_ZOOM_LEVEL);
    }
});

function loadAreaPoligon() {
    axios.get('/api/area')  // 동호회 있는 시/군구만 필터링된 JSON 데이터
      .then(response => {
        const features = response.data.features;
        console.log("응답 데이터:", features);
  
        features.forEach(regionFeature => {
            console.log("제발 !!!",regionFeature)
  
          // geoJsonData에서 해당 지역 이름에 맞는 Feature 찾기
          
  
          if (regionFeature) {
            const coordinates = regionFeature.geometry.coordinates[0]; 
            const selectedRegionName = regionFeature.properties.SIG_KOR_NM;
  
            const path = coordinates.map(coord => new kakao.maps.LatLng(coord[1], coord[0]));
            // console.log("path : ",path)

            const polygon = new kakao.maps.Polygon({
              path: path,
              strokeWeight: 2,
              strokeColor: '#004c80',
              strokeOpacity: 0.8,
              fillColor: '#00a0e9',
              fillOpacity: 0.5
            });
  
            polygon.setMap(map);
            polygons.push(polygon);
  
            kakao.maps.event.addListener(polygon, 'click', async function () {
              console.log("클릭된 시/군구 이름:", selectedRegionName);
              try {
                const res = await axios.get(`/area?wide_regions=${encodeURIComponent(selectedRegionName)}`);
                console.log("동호회 목록 응답 데이터:", res.data);
                updateClubList(res.data);
              } catch (error) {
                console.log("동호회 목록을 가져오는 데 실패했습니다.", error);
              }
            });
          } else {
            console.log("해당 시/군구가 geoJsonData에 없음:", regionName);
          }
        });
      })
      .catch(error => {
        console.log('GeoJSON 요청 실패:', error);
      });
  }
  


  // 동호회 목록 초기화 함수
function clearClubList() {
    clubList.innerHTML = '';  // 동호회 목록을 비워줌
}

  // 동호회 목록 업데이트 함수
  function updateClubList(clubs) {
    clubList.innerHTML = '';  // 기존 동호회 목록 초기화

    if (clubs.length === 0) {
      clubList.innerHTML = '조회된 동호회가 없습니다';
      return;
    }
    console.log("야야",clubs)
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
  }



// 지하철역 마커를 보여주는 함수수
async function loadStationMarkers() {
    try {
      const response = await axios.get('/api/station');
      const stationsData = response.data;
      console.log(stationsData);
  
      if (stationsData.DATA) {
        stationsData.DATA.forEach(function (station) {
            station.image.forEach((image, index) => {
                const lat = parseFloat(station.lat);
                const lot = parseFloat(station.lot);
                
                const latLng = new kakao.maps.LatLng(lat, lot);
                const total = 30;
                const increment = 10;
                const percent = (station.MembersCount * increment) > 100 ? 100 : station.MembersCount * increment;
                const calculate = total * percent / 100;
                const value = total + calculate;
            
                const markerDiv = document.createElement('div');
                markerDiv.style.width = `${value}px`;
                markerDiv.style.height = `${value}px`;
                markerDiv.style.border = '2px solid black';
                markerDiv.style.background = '#ff7a00';
                markerDiv.style.borderRadius = '50%';
                markerDiv.style.overflow = 'hidden';
                markerDiv.style.boxSizing = 'border-box';
                markerDiv.style.cursor = 'pointer';
                markerDiv.style.transform = `translateX(${value * index}px)`;
                
                const img = document.createElement('img');
                img.src = image;
                img.style.width = '100%';
                img.style.height = '100%';
                img.style.objectFit = 'cover';
                
                markerDiv.appendChild(img);
            
                const overlay = new kakao.maps.CustomOverlay({
                    content: markerDiv,
                    position: latLng,
                    xAnchor: 0.5,
                    yAnchor: 1
                });
            
                overlay.setMap(map);
            
                // 🔥 클릭 이벤트
                markerDiv.addEventListener('click', async () => {
                    const local_station = station.bldn_nm;
                    const index = result[0];
            
                    try {
                        const res = await axios.get(`/station?index=${index}&local_station=${encodeURIComponent(local_station)}`);
                        console.log("서버 응답 데이터:", res.data.data);
            
                        const clubs = res.data.data;
                        updateClubList(clubs);
                    } catch (error) {
                        console.log("동호회 목록을 가져오는 데 실패했습니다.", error);
                    }
                });
            
                // 마커(오버레이) 저장
                stationMarkers.push(overlay);
            });
        });
      } else {
        console.log("지하철역 데이터가 없습니다.");
      }
    } catch (error) {
      console.log("지하철역 데이터를 불러오는 데 실패했습니다.", error);
    }
  
    // 동호회 목록 업데이트 함수
    function updateClubList(clubs) {
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
    }
  }
  
function clearStationMarkers() {
    stationMarkers.forEach(function (marker) {
        marker.setMap(null);
    });
    stationMarkers = [];
}

function clearPolygons() {
    polygons.forEach(function (polygon) {
        polygon.setMap(null);
    });
    polygons = [];
}

function drawPolygon(coords) {
    const color = '#FF3B30';
    coords.forEach(function (ring) {
        const path = ring.map(function (coord) {
            return new kakao.maps.LatLng(coord[1], coord[0]);
        });
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
