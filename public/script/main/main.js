window.addEventListener("load", () => {
  setTimeout(() => {
      const loading = document.getElementById("loading");
      if (loading) loading.style.display = "none";
  }, 1500); // 로딩 시간 약간 증가하여 부드러운 경험 제공


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
  const loadingScreenAnimation = loadingScreen?.animate(
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

  if (loadingScreenAnimation) {
      loadingScreenAnimation.onfinish = () => {
          document.getElementById("loading").style.display = "none";
      };
  }
});  

// 카테고리 필터 기능
const result = ["member", "like", "review", "star"];
const filterBtns = document.querySelectorAll('.category-btn');
const clubList = document.querySelector('.club-list');

// 카테고리 버튼 활성화 함수
function setActiveCategoryBtn(clickedBtn) {
  filterBtns.forEach(btn => {
      btn.classList.remove('active');
  });
  clickedBtn.classList.add('active');
}

for (let i = 0; i < filterBtns.length; i++) {
  filterBtns[i].onclick = async () => {
      setActiveCategoryBtn(filterBtns[i]);
      
      try {
          // 로딩 표시
          clubList.innerHTML = '<div class="loading-message" style="text-align: center; padding: 30px;"><p>동호회 정보를 불러오는 중입니다...</p></div>';
          
          const filterData = await axios.get(`/filter?index=${result[i]}`);
          const clubs = filterData.data.data;
          clubList.innerHTML = '';

          if (!clubs || clubs.length === 0) {
              clubList.innerHTML = '<div class="no-results" style="text-align: center; padding: 40px 20px; color: #777;"><p>조회된 동호회가 없습니다</p></div>';
              return;
          }

          clubs.forEach(club => {
              const clubItem = document.createElement('div');
              clubItem.classList.add('club-item');
              clubItem.addEventListener('click', () => {
                  if (club.club_id) {
                      window.location.href = `/clubs/detail/${club.club_id}`;
                  }
              });

              // 공통 출력 정보
              let extraInfo = '';
              if (result[i] === 'member') {
                  extraInfo = `<p><strong>회원 수:</strong> ${club.MemberCount || 0}명</p>`;
              } else if (result[i] === 'like') {
                  extraInfo = `<p><strong>좋아요:</strong> ${club.HeartCount || 0}</p>`;
              } else if (result[i] === 'review') {
                  extraInfo = `<p><strong>조회수:</strong> ${club.view_count || 0}</p>`;
              } else if (result[i] === 'star') {
                  extraInfo = `<p><strong>평점:</strong> ${parseFloat(club.ReviewCount || 0).toFixed(1)}</p>`;
              }

              clubItem.innerHTML = `
                  <img src="${club.image || '/public/images/default-club.png'}" alt="${club.name || '동호회'}" class="club-image">
                  <h3>${club.name || '이름 없음'}</h3>
                  <p>${club.introduction ? (club.introduction.length > 70 ? club.introduction.substring(0, 70) + '...' : club.introduction) : '설명이 없습니다.'}</p>
                  ${extraInfo}
              
              `;

              clubList.appendChild(clubItem);
          });
      } catch (error) {
          console.log('필터링 중 오류 발생:', error);
          clubList.innerHTML = '<div class="error-message" style="text-align: center; padding: 30px; color: #e74c3c;"><p>동호회 정보를 불러오는 중 오류가 발생했습니다.</p></div>';
      }
  };
}

// 맵 초기화 및 관련 기능
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

const map = new kakao.maps.Map(mapContainer, mapOptions);
const zoomLabel = document.getElementById('zoomLabel');

// 사용자 위치 정보 가져오기
if (navigator.geolocation) {
  navigator.geolocation.getCurrentPosition(function(position) {
      const lat = position.coords.latitude;
      const lng = position.coords.longitude;
      const currentLoc = new kakao.maps.LatLng(lat, lng);
      
      userLocation = currentLoc; // 위치 저장

      map.setCenter(currentLoc);

      // 사용자 위치 마커 생성
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
      loadStationMarkers(); // 위치 정보를 가져오지 못해도 지하철 마커 표시
  });
} else {
  alert("이 브라우저는 위치 정보를 지원하지 않습니다.");
  loadStationMarkers(); // 위치 정보를 지원하지 않아도 지하철 마커 표시
}

// 지도 컨트롤 버튼 생성 및 스타일 개선
const wideAreaButton = document.createElement('button');
wideAreaButton.textContent = '광역단위 보기';
wideAreaButton.id = 'wideAreaButton';
wideAreaButton.className = 'map-control-btn';
wideAreaButton.style.position = 'absolute';
wideAreaButton.style.top = '20px';
wideAreaButton.style.right = '20px';
wideAreaButton.style.zIndex = 1000;
mapContainer.appendChild(wideAreaButton);

const regionAreaButton = document.createElement('button');
regionAreaButton.textContent = '지역단위 보기';
regionAreaButton.id = 'regionAreaButton';
regionAreaButton.className = 'map-control-btn';
regionAreaButton.style.position = 'absolute';
regionAreaButton.style.top = '70px';
regionAreaButton.style.right = '20px';
regionAreaButton.style.zIndex = 1000;
mapContainer.appendChild(regionAreaButton);

const currentLocationButton = document.createElement('button');
currentLocationButton.textContent = '내 위치로 이동';
currentLocationButton.id = 'currentLocationButton';
currentLocationButton.className = 'map-control-btn';
currentLocationButton.style.position = 'absolute';
currentLocationButton.style.top = '120px';
currentLocationButton.style.right = '20px';
currentLocationButton.style.zIndex = 1000;
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
  loadAreaPoligon(); // 시/군구 폴리곤 로드
});

// 줌 레벨 제한
kakao.maps.event.addListener(map, 'zoom_changed', function () {
  const currentZoom = map.getLevel();
  if (currentZoom < MIN_ZOOM_LEVEL) {
      map.setLevel(MIN_ZOOM_LEVEL);
  } else if (currentZoom > MAX_ZOOM_LEVEL) {
      map.setLevel(MAX_ZOOM_LEVEL);
  }
});

// 지역 폴리곤 로드
function loadAreaPoligon() {
  axios.get('/api/area')
      .then(response => {
          const features = response.data.features;
          console.log("응답 데이터:", features);
  
          features.forEach(regionFeature => {
              if (regionFeature) {
                  const coordinates = regionFeature.geometry.coordinates[0]; 
                  const selectedRegionName = regionFeature.properties.SIG_KOR_NM;
  
                  const path = coordinates.map(coord => new kakao.maps.LatLng(coord[1], coord[0]));

                  const polygon = new kakao.maps.Polygon({
                      path: path,
                      strokeWeight: 2,
                      strokeColor: '#ffb402',
                      strokeOpacity: 0.8,
                      fillColor: '#ffb402',
                      fillOpacity: 0.3
                  });
  
                  polygon.setMap(map);
                  polygons.push(polygon);
  
                  // 폴리곤 클릭 이벤트
                  kakao.maps.event.addListener(polygon, 'click', async function () {
                      console.log("클릭된 시/군구 이름:", selectedRegionName);
                      try {
                          // 로딩 표시
                          clubList.innerHTML = '<div class="loading-message" style="text-align: center; padding: 30px;"><p>동호회 정보를 불러오는 중입니다...</p></div>';
                          
                          const res = await axios.get(`/area?wide_regions=${encodeURIComponent(selectedRegionName)}`);
                          console.log("동호회 목록 응답 데이터:", res.data);
                          updateClubList(res.data);
                      } catch (error) {
                          console.log("동호회 목록을 가져오는 데 실패했습니다.", error);
                          clubList.innerHTML = '<div class="error-message" style="text-align: center; padding: 30px; color: #e74c3c;"><p>동호회 정보를 불러오는 중 오류가 발생했습니다.</p></div>';
                      }
                  });
                  
                  // 폴리곤 마우스오버 이벤트
                  kakao.maps.event.addListener(polygon, 'mouseover', function() {
                      polygon.setOptions({
                          fillColor: '#f39c12',
                          fillOpacity: 0.5
                      });
                  });
                  
                  // 폴리곤 마우스아웃 이벤트
                  kakao.maps.event.addListener(polygon, 'mouseout', function() {
                      polygon.setOptions({
                          fillColor: '#ffb402',
                          fillOpacity: 0.3
                      });
                  });
              } else {
                  console.log("해당 시/군구가 없음:", regionName);
              }
          });
      })
      .catch(error => {
          console.log('GeoJSON 요청 실패:', error);
      });
}

// 동호회 목록 초기화 함수
function clearClubList() {
  clubList.innerHTML = '<div class="initial-message" style="text-align: center; padding: 40px 20px; color: #777;"><p>지도에서 지역을 선택하거나 카테고리 버튼을 클릭하여 동호회를 찾아보세요.</p></div>';
}

// 동호회 목록 업데이트 함수
function updateClubList(clubs) {
  clubList.innerHTML = '';  // 기존 동호회 목록 초기화

  if (!clubs || clubs.length === 0) {
      clubList.innerHTML = '<div class="no-results" style="text-align: center; padding: 40px 20px; color: #777;"><p>조회된 동호회가 없습니다</p></div>';
      return;
  }

  clubs.forEach(club => {
      const clubItem = document.createElement('div');
      clubItem.classList.add('club-item');
      clubItem.addEventListener('click', () => {
          if (club.club_id) {
              window.location.href = `/clubs/detail/${club.club_id}`;
          }
      });

      clubItem.innerHTML = `
          <img src="${club.image || '/public/images/default-club.png'}" alt="${club.name || '동호회'}" class="club-image">
          <h3>${club.name || '이름 없음'}</h3>
          <p>${club.introduction ? (club.introduction.length > 70 ? club.introduction.substring(0, 70) + '...' : club.introduction) : '설명이 없습니다.'}</p>
          <div class="club-meta">
              <span class="club-type-badge ${club.activity_type || 'local'}">${club.activity_type === 'local' ? '지역기반' : '광역기반'}</span>
              <span class="club-member-count">회원 ${club.member_count || 0}명</span>
          </div>
      `;

      clubList.appendChild(clubItem);
  });

  // 클릭 가능함을 알려주는 안내 텍스트 추가
  const infoText = document.createElement('div');
  infoText.className = 'info-text';
  infoText.style.textAlign = 'center';
  infoText.style.padding = '15px';
  infoText.style.color = '#777';
  infoText.style.fontSize = '0.9em';
  infoText.style.borderTop = '1px solid #eee';
  infoText.style.marginTop = '20px';
  infoText.innerHTML = '동호회 카드를 클릭하면 상세 페이지로 이동합니다';
  clubList.appendChild(infoText);
}

// 지하철역 마커를 보여주는 함수
async function loadStationMarkers() {
  try {
      const response = await axios.get('/api/station');
      const stationsData = response.data;
      
      if (stationsData.DATA) {
          stationsData.DATA.forEach(function (station) {
              if (station.image && station.image.length > 0) {
                  station.image.forEach((image, index) => {
                      const lat = parseFloat(station.lat);
                      const lot = parseFloat(station.lot);
                      
                      const latLng = new kakao.maps.LatLng(lat, lot);
                      const total = 30;
                      const increment = 10;
                      const percent = (station.MembersCount * increment) > 100 ? 100 : station.MembersCount * increment;
                      const calculate = total * percent / 100;
                      const value = total + calculate;
                  
                      // 컨테이너 생성
                      const containerDiv = document.createElement('div');
                      containerDiv.style.position = 'relative';
                      containerDiv.style.width = `${value}px`;
                      containerDiv.style.height = `${value}px`;
                      
                      // 마커 이미지 생성
                      const markerDiv = document.createElement('div');
                      markerDiv.style.width = '100%';
                      markerDiv.style.height = '100%';
                      markerDiv.style.border = '2px solid #ffb402';
                      markerDiv.style.background = 'white';
                      markerDiv.style.borderRadius = '50%';
                      markerDiv.style.overflow = 'hidden';
                      markerDiv.style.boxSizing = 'border-box';
                      markerDiv.style.cursor = 'pointer';
                      markerDiv.style.boxShadow = '0 2px 6px rgba(255, 180, 2, 0.5)';
                      markerDiv.style.transition = 'all 0.3s ease';
                      
                      // 호버 효과
                      markerDiv.onmouseover = function() {
                          this.style.transform = 'scale(1.1)';
                          this.style.boxShadow = '0 4px 10px rgba(255, 180, 2, 0.7)';
                      };
                      
                      markerDiv.onmouseout = function() {
                          this.style.transform = 'scale(1)';
                          this.style.boxShadow = '0 2px 6px rgba(255, 180, 2, 0.5)';
                      };
                      
                      // 이미지 추가
                      const img = document.createElement('img');
                      img.src = image || '/public/images/default-club.png';
                      img.style.width = '100%';
                      img.style.height = '100%';
                      img.style.objectFit = 'cover';
                      
                      // 역 이름 레이블 추가
                      const labelDiv = document.createElement('div');
                      labelDiv.textContent = station.bldn_nm || '역 정보 없음';
                      labelDiv.style.position = 'absolute';
                      labelDiv.style.bottom = '-25px';
                      labelDiv.style.left = '50%';
                      labelDiv.style.transform = 'translateX(-50%)';
                      labelDiv.style.whiteSpace = 'nowrap';
                      labelDiv.style.background = 'rgba(0, 0, 0, 0.7)';
                      labelDiv.style.color = 'white';
                      labelDiv.style.padding = '3px 8px';
                      labelDiv.style.borderRadius = '10px';
                      labelDiv.style.fontSize = '12px';
                      labelDiv.style.fontWeight = 'bold';
                      labelDiv.style.opacity = '0';
                      labelDiv.style.transition = 'opacity 0.3s ease';
                      
                      // 호버 시 레이블 표시
                      markerDiv.onmouseover = function() {
                          this.style.transform = 'scale(1.1)';
                          this.style.boxShadow = '0 4px 10px rgba(255, 180, 2, 0.7)';
                          labelDiv.style.opacity = '1';
                      };
                      
                      markerDiv.onmouseout = function() {
                          this.style.transform = 'scale(1)';
                          this.style.boxShadow = '0 2px 6px rgba(255, 180, 2, 0.5)';
                          labelDiv.style.opacity = '0';
                      };
                      
                      markerDiv.appendChild(img);
                      containerDiv.appendChild(markerDiv);
                      containerDiv.appendChild(labelDiv);
                  
                      const overlay = new kakao.maps.CustomOverlay({
                          content: containerDiv,
                          position: latLng,
                          xAnchor: 0.5,
                          yAnchor: 0.5
                      });
                  
                      overlay.setMap(map);
                  
                      // 클릭 이벤트
                      containerDiv.addEventListener('click', async () => {
                          const local_station = station.bldn_nm;
                          const index = result[0];
                  
                          try {
                              clubList.innerHTML = '<div class="loading-message" style="text-align: center; padding: 30px;"><p>동호회 정보를 불러오는 중입니다...</p></div>';
                              
                              const res = await axios.get(`/station?index=${index}&local_station=${encodeURIComponent(local_station)}`);
                              console.log("서버 응답 데이터:", res.data.data);
                  
                              const clubs = res.data.data;
                              updateClubList(clubs);
                          } catch (error) {
                              console.log("동호회 목록을 가져오는 데 실패했습니다.", error);
                              clubList.innerHTML = '<div class="error-message" style="text-align: center; padding: 30px; color: #e74c3c;"><p>동호회 정보를 불러오는 중 오류가 발생했습니다.</p></div>';
                          }
                      });
                  
                      // 마커(오버레이) 저장
                      stationMarkers.push(overlay);
                  });
              }
          });
      } else {
          console.log("지하철역 데이터가 없습니다.");
      }
  } catch (error) {
      console.log("지하철역 데이터를 불러오는 데 실패했습니다.", error);
  }
}

// 지하철역 마커 삭제 함수
function clearStationMarkers() {
  stationMarkers.forEach(function (marker) {
      marker.setMap(null);
  });
  stationMarkers = [];
}

// 폴리곤 삭제 함수
function clearPolygons() {
  polygons.forEach(function (polygon) {
      polygon.setMap(null);
  });
  polygons = [];
}

// 초기에 회원순 버튼 활성화 (페이지 로드 후 자동으로 데이터 로드)
document.addEventListener('DOMContentLoaded', function() {
  // 첫 번째 카테고리 버튼 클릭 이벤트 발생시키기
  if (filterBtns.length > 0) {
      filterBtns[0].click();
  }
});