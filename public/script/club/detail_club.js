
document.addEventListener('DOMContentLoaded', function() {
    // 탭 기능 구현
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabPanes = document.querySelectorAll('.tab-pane');
    
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            // 활성화된 탭 버튼 스타일 변경
            tabButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            
            // 탭 콘텐츠 표시/숨김 처리
            const tabId = button.getAttribute('data-tab');
            tabPanes.forEach(pane => {
                if (pane.id === tabId) {
                    pane.classList.add('active');
                } else {
                    pane.classList.remove('active');
                }
            });
        });
    });
    
    // 찜하기 버튼 기능
    const heartButton = document.querySelector('.btn-heart');
    if (heartButton) {
        heartButton.addEventListener('click', () => {
            heartButton.classList.toggle('active');
            
            // 찜 상태에 따라 아이콘 변경
            const heartIcon = heartButton.querySelector('.heart-icon');
            if (heartButton.classList.contains('active')) {
                heartIcon.textContent = '♥'; // 채워진 하트
                // 서버에 찜하기 요청
                // fetch('/api/clubs/123/heart', { method: 'POST' });
            } else {
                heartIcon.textContent = '♡'; // 빈 하트
                // 서버에 찜 취소 요청
                // fetch('/api/clubs/123/heart', { method: 'DELETE' });
            }
        });
    }
    
    // 캘린더 초기화
    initializeCalendar();
    
    // 일정 모달 이벤트 처리
    const modalClose = document.querySelector('.close-modal');
    const scheduleModal = document.getElementById('schedule-detail-modal');
    
    if (modalClose && scheduleModal) {
        modalClose.addEventListener('click', () => {
            scheduleModal.style.display = 'none';
        });
        
        // 모달 외부 클릭 시 닫기
        window.addEventListener('click', (event) => {
            if (event.target === scheduleModal) {
                scheduleModal.style.display = 'none';
            }
        });
    }
    
    // 참여 투표 버튼 이벤트
    const pollButtons = document.querySelectorAll('.poll-btn');
    pollButtons.forEach(button => {
        button.addEventListener('click', () => {
            // 기존 선택된 버튼에서 active 클래스 제거
            pollButtons.forEach(btn => btn.classList.remove('active'));
            // 클릭한 버튼에 active 클래스 추가
            button.classList.add('active');
            
            // 여기에 서버로 투표 정보를 보내는 로직 추가
            // 예: updateParticipation(button.classList.contains('poll-yes') ? 'yes' : (button.classList.contains('poll-no') ? 'no' : 'maybe'));
        });
    });
    
    // 게스트 참여 신청 버튼 이벤트
    const guestApplyBtn = document.querySelector('.btn-guest-apply');
    if (guestApplyBtn) {
        guestApplyBtn.addEventListener('click', () => {
            // 게스트 참여 신청 폼 또는 모달 표시 로직
            alert('게스트 참여 신청이 접수되었습니다. 승인을 기다려주세요.');
        });
    }
    
    // 멤버 검색 기능
    const memberSearchInput = document.querySelector('.search-input');
    if (memberSearchInput) {
        memberSearchInput.addEventListener('input', (e) => {
            const searchTerm = e.target.value.toLowerCase();
            const memberCards = document.querySelectorAll('.member-card');
            
            memberCards.forEach(card => {
                const memberName = card.querySelector('.member-name').textContent.toLowerCase();
                if (memberName.includes(searchTerm)) {
                    card.style.display = 'flex';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    }
    
    // 리뷰 작성 버튼 이벤트
    const writeReviewBtn = document.querySelector('.btn-write-review');
    const reviewForm = document.querySelector('.review-form');
    const cancelReviewBtn = document.querySelector('.btn-cancel-review');
    const submitReviewBtn = document.querySelector('.btn-submit-review');
    
    if (writeReviewBtn && reviewForm) {
        writeReviewBtn.addEventListener('click', () => {
            reviewForm.style.display = 'block';
            writeReviewBtn.style.display = 'none';
        });
    }
    
    if (cancelReviewBtn) {
        cancelReviewBtn.addEventListener('click', () => {
            reviewForm.style.display = 'none';
            writeReviewBtn.style.display = 'block';
            // 폼 리셋
            document.querySelector('.review-textarea').value = '';
            document.querySelectorAll('input[name="rating"]').forEach(radio => radio.checked = false);
        });
    }
    
    if (submitReviewBtn) {
        submitReviewBtn.addEventListener('click', () => {
            const reviewText = document.querySelector('.review-textarea').value;
            const ratingValue = document.querySelector('input[name="rating"]:checked')?.value;
            
            if (!reviewText || reviewText.length < 20) {
                alert('리뷰는 최소 20자 이상 작성해주세요.');
                return;
            }
            
            if (!ratingValue) {
                alert('평점을 선택해주세요.');
                return;
            }
            
            // 리뷰 제출 로직
            alert('리뷰가 등록되었습니다.');
            reviewForm.style.display = 'none';
            writeReviewBtn.style.display = 'block';
            
            // 리뷰 목록 새로고침 로직 추가
            // refreshReviews();
            
            // 폼 리셋
            document.querySelector('.review-textarea').value = '';
            document.querySelectorAll('input[name="rating"]').forEach(radio => radio.checked = false);
        });
    }
    
    // 리뷰 수정/삭제 버튼 이벤트
    const editReviewBtns = document.querySelectorAll('.btn-edit-review');
    const deleteReviewBtns = document.querySelectorAll('.btn-delete-review');
    
    editReviewBtns.forEach(button => {
        button.addEventListener('click', (e) => {
            const reviewItem = e.target.closest('.review-item');
            const reviewContent = reviewItem.querySelector('.review-content p').textContent;
            const reviewRating = reviewItem.querySelector('.review-rating').textContent.split('').filter(char => char === '★').length;
            
            // 리뷰 폼에 기존 내용 설정
            document.querySelector('.review-textarea').value = reviewContent;
            document.querySelector(`input[name="rating"][value="${reviewRating}"]`).checked = true;
            
            // 폼 표시
            reviewForm.style.display = 'block';
            writeReviewBtn.style.display = 'none';
            
            // 편집 중인 리뷰 ID 설정 (실제 구현에서는 데이터 속성 등으로 관리)
            reviewForm.setAttribute('data-editing-review-id', reviewItem.getAttribute('data-review-id'));
        });
    });
    
    deleteReviewBtns.forEach(button => {
        button.addEventListener('click', (e) => {
            if (confirm('리뷰를 삭제하시겠습니까?')) {
                const reviewItem = e.target.closest('.review-item');
                // 실제 구현에서는 서버에 삭제 요청 후 성공 시 아래 코드 실행
                reviewItem.remove();
                alert('리뷰가 삭제되었습니다.');
            }
        });
    });
    
    // 참여 인증 사진 업로드 기능
    const uploadBtn = document.querySelector('.btn-upload-verification');
    const verificationForm = document.querySelector('.verification-form');
    const cancelBtn = document.querySelector('.btn-cancel-verification');
    const submitBtn = document.querySelector('.btn-submit-verification');
    const uploadBox = document.querySelector('.verification-upload-box');
    const fileInput = document.getElementById('verification-image');
    const previewContainer = document.querySelector('.verification-preview');
    const previewImg = document.getElementById('verification-preview-img');
    const removePreviewBtn = document.querySelector('.btn-remove-preview');

    if (uploadBtn && verificationForm) {
        uploadBtn.addEventListener('click', () => {
            verificationForm.style.display = 'block';
            uploadBtn.style.display = 'none';
        });
    }

    if (cancelBtn) {
        cancelBtn.addEventListener('click', () => {
            verificationForm.style.display = 'none';
            uploadBtn.style.display = 'block';
            resetVerificationForm();
        });
    }

    if (uploadBox && fileInput) {
        uploadBox.addEventListener('click', () => {
            fileInput.click();
        });

        fileInput.addEventListener('change', (e) => {
            if (e.target.files && e.target.files[0]) {
                const file = e.target.files[0];
                const reader = new FileReader();

                reader.onload = function(e) {
                    previewImg.src = e.target.result;
                    previewContainer.style.display = 'block';
                    uploadBox.style.display = 'none';
                };

                reader.readAsDataURL(file);
            }
        });
    }

    if (removePreviewBtn) {
        removePreviewBtn.addEventListener('click', () => {
            resetVerificationPreview();
        });
    }

    if (submitBtn) {
        submitBtn.addEventListener('click', () => {
            const eventSelect = document.querySelector('.event-select');
            if (!eventSelect.value) {
                alert('모임을 선택해주세요.');
                return;
            }

            if (!fileInput.files || fileInput.files.length === 0) {
                alert('인증 사진을 업로드해주세요.');
                return;
            }

            // 여기에 서버로 인증 사진 업로드 로직 추가
            alert('참여 인증이 등록되었습니다.');
            verificationForm.style.display = 'none';
            uploadBtn.style.display = 'block';
            resetVerificationForm();

            // 갤러리 새로고침 로직 추가
            // refreshVerificationGallery();
        });
    }

    function resetVerificationForm() {
        if (fileInput) fileInput.value = '';
        resetVerificationPreview();
        const eventSelect = document.querySelector('.event-select');
        if (eventSelect) eventSelect.value = '';
    }

    function resetVerificationPreview() {
        if (previewContainer) previewContainer.style.display = 'none';
        if (uploadBox) uploadBox.style.display = 'block';
        if (previewImg) previewImg.src = '';
    }

    // 필터 기능
    const filterEvent = document.querySelector('.filter-event');
    if (filterEvent) {
        filterEvent.addEventListener('change', (e) => {
            const value = e.target.value;
            const allItems = document.querySelectorAll('.verification-item');

            if (value === 'all') {
                allItems.forEach(item => {
                    item.style.display = 'block';
                });
            } else {
                allItems.forEach(item => {
                    const eventText = item.querySelector('.verification-event').textContent;
                    if (eventText.includes(getEventNameById(value))) {
                        item.style.display = 'block';
                    } else {
                        item.style.display = 'none';
                    }
                });
            }
        });
    }

    function getEventNameById(id) {
        // 간단한 매핑을 위한 함수
        const events = {
            '1': '정기 축구 모임',
            '2': '번개 모임',
            '3': '월례 회식'
        };
        return events[id] || '';
    }

    // 더보기 버튼
    const loadMoreBtn = document.querySelector('.btn-load-more');
    if (loadMoreBtn) {
        loadMoreBtn.addEventListener('click', () => {
            // 여기에 추가 인증 사진 로드 로직 추가
            alert('추가 인증 사진을 로드합니다.');
            // loadMoreVerifications();
        });
    }
});

// 캘린더 초기화 함수
function initializeCalendar() {
    const calendarEl = document.getElementById('calendar');
    if (!calendarEl) return;
    
    const calendar = new FullCalendar.Calendar(calendarEl, {
        initialView: 'dayGridMonth',
        headerToolbar: {
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek,listMonth'
        },
        locale: 'ko',
        events: [
            {
                title: '정기 축구 모임',
                start: '2025-04-13T10:00:00',
                end: '2025-04-13T12:00:00',
                extendedProps: {
                    location: '강남 풋살파크',
                    description: '정기 축구 모임입니다. 간단한 준비운동 후 5:5 미니게임으로 진행됩니다.'
                }
            },
            {
                title: '번개 모임',
                start: '2025-04-20T14:00:00',
                end: '2025-04-20T16:00:00',
                extendedProps: {
                    location: '잠실 축구장',
                    description: '인근 동호회와 친선 경기가 있습니다.'
                }
            },
            {
                title: '월례 회식',
                start: '2025-04-27T18:00:00',
                extendedProps: {
                    location: '강남역 맛집',
                    description: '4월 정기 회식입니다. 참가비 2만원.'
                }
            }
        ],
        eventClick: function(info) {
            // 이벤트 클릭 시 모달에 정보 설정
            document.querySelector('.modal-title').textContent = info.event.title;
            const modalBody = document.querySelector('.modal-body');
            
            // 이벤트 날짜 포맷
            const startDate = info.event.start;
            const endDate = info.event.end;
            const dateString = startDate.toLocaleDateString('ko-KR', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric', 
                weekday: 'long' 
            });
            
            // 시간 포맷
            let timeString = "";
            if (startDate) {
                timeString += startDate.toLocaleTimeString('ko-KR', { 
                    hour: '2-digit', 
                    minute: '2-digit',
                    hour12: true
                });
                
                if (endDate) {
                    timeString += " - " + endDate.toLocaleTimeString('ko-KR', { 
                        hour: '2-digit', 
                        minute: '2-digit',
                        hour12: true
                    });
                }
            }
            
            // 모달 정보 업데이트
            const eventInfoElement = document.querySelector('.event-info');
            eventInfoElement.innerHTML = `
                <p><strong>날짜:</strong> ${dateString}</p>
                <p><strong>시간:</strong> ${timeString}</p>
                <p><strong>장소:</strong> ${info.event.extendedProps.location || '미정'}</p>
                <p><strong>설명:</strong> ${info.event.extendedProps.description || '설명 없음'}</p>
            `;
            
            // 모달 표시
            document.getElementById('schedule-detail-modal').style.display = 'flex';
        },
        eventTimeFormat: {
            hour: '2-digit',
            minute: '2-digit',
            meridiem: true
        }
    });
    
    calendar.render();
    
    // 일정 뷰 변경 이벤트
    const scheduleViewSelect = document.getElementById('schedule-view');
    if (scheduleViewSelect) {
        scheduleViewSelect.addEventListener('change', (e) => {
            const view = e.target.value;
            calendar.changeView(view);
        });
    }
}
