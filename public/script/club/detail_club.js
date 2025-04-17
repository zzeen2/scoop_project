document.addEventListener('DOMContentLoaded', function () {

    const btn_like = document.querySelector(".btn_like");
    if (btn_like) {
        btn_like.onclick = async () => {
            const clubId = btn_like.dataset.clubid;
        try {
            const res = await axios.post(`/clubs/detail/${clubId}/heart`);
            if (res.data.state === 402) {
                Popupwrap.classList.add('popup')
            return;
        }
        const result = res.data;
        btn_like.classList.toggle("on", result.liked);
        } catch (error) {
            alert("서버 오류가 발생했습니다."); 
        }
    };
    }
    const join_btn = document.getElementById("join_btn");
    if (join_btn) {
    join_btn.addEventListener("click", async () => {
        try {
        const res = await axios.post(`/clubs/detail/${clubId}/member`);
        if (res.data.state === 200) {
            alert("가입신청이 되었습니다!");
        } else if (res.data.state === 400) {
            alert("로그인이 필요합니다.");
            setTimeout(() => {
            window.location.assign("/login");
            });
        }
        } catch (error) {
        alert("가입신청 중 에러 발생");
        }
    });
}
    
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabPanes = document.querySelectorAll('.tab-pane');

    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
        const targetId = button.dataset.tab;
        tabButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
        tabPanes.forEach(pane => {
            pane.classList.toggle('active', pane.id === targetId);
        });
    });
    });

    document.querySelector('.close-modal').addEventListener('click', () => {
        document.getElementById('schedule-detail-modal').style.display = 'none';
    });

    initializeCalendar();

    function renderParticipantBtn(eventId) {
        const container = document.querySelector('.participation-poll');
        if (isMember) {
        container.innerHTML = `
            <h4>참여 여부</h4>
            <div class="poll-options">
            <button class="poll-btn poll-yes" data-state="yes">참석</button>
            <button class="poll-btn poll-no" data-state="no">불참</button>
            <button class="poll-btn poll-maybe" data-state="maybe">미정</button>
            </div>
        `;
        } else {
        container.innerHTML = `
            <h4>게스트 참여</h4>
            <p>이번모임에 게스트로 참가 신청하시겠습니까?</p>
            <button class="btn btn-guest-apply">일일참가 신청</button>
        `;
    }
    }

    document.addEventListener("click", async (e) => {
        const modal = document.getElementById('schedule-detail-modal');
        const eventId = modal.dataset.eventId;
    
        if (e.target.classList.contains('poll-btn')) {
            const state = e.target.dataset.state;
            try {
                const res = await axios.post(`/clubs/detail/events/${eventId}/participate`, {
                    userId,
                    clubId,
                    state
                });
                if (res.data.success) {
                    alert("참여정보가 저장되었습니다.");
                    location.reload();
                } else {
                    console.log("참여 실패:", res.data.message);
                }
            } catch (error) {
                console.error("참여 저장 실패", error);
            }
        }
    
        if (e.target.classList.contains('btn-guest-apply')) {
            try {
                if (!userId || userId === "") {
                    alert("로그인이 필요합니다.");
                    location.href = "/login";
                    return;
                }
                const res = await axios.post(`/clubs/detail/events/${eventId}/participate`, {
                    userId,
                    clubId,
                    state: 'guest' 
                });
                if (res.data.success) {
                    alert("일일참가 신청이 완료되었습니다.");
                    location.reload();
                } else {
                    alert(res.data.message || "신청 실패");
                }
            } catch (err) {
                alert("서버 오류");
            }
        }
    });
    
    function renderParticipantGroup(selector, names = [], role = 'participant') {
    const container = document.querySelector(`.participant-list${selector}`) || document.querySelector(selector);
    if (!container) return;
    const parentGroup = container.closest('.participant-group');
    if (parentGroup) {
        const heading = parentGroup.querySelector('h5');
        if (heading) {
        const label = role === 'attending' ? '참석'
                    : role === 'not-attending' ? '불참'
                    : role === 'maybe' ? '미정'
                    : role === 'guest' ? '게스트 참여자'
                    : '명단';
        heading.innerHTML = `${label} (${names.length}명)`;
        }
    }
    const className = role === 'guest' ? 'guest-name' : 'participant';
    const html = names.length
        ? names.map(name => `<span class="${className}">${name}</span>`).join('')
        : '<span style="color: #888;">없음</span>';
    container.innerHTML = html;
    }

    function openScheduleModal(info) {
    const event = info.event;
    const props = event.extendedProps;
    const full = props.fullData;
    const modal = document.getElementById('schedule-detail-modal');
    modal.dataset.eventId = event.id;

    document.querySelector('.modal-title').textContent = event.title;
    document.querySelector('.event-info').innerHTML = `
        <p><strong>날짜:</strong> ${formatDate(event.start)}</p>
        <p><strong>장소:</strong> ${props.location || '장소 정보 없음'}</p>
        <p><strong>설명:</strong> ${props.description || '설명 없음'}</p>
    `;

    modal.style.display = 'flex';
    setTimeout(() => {
        renderParticipantGroup('.attending', full.attending || [], 'attending');
        renderParticipantGroup('.not-attending', full.notAttending || [], 'not-attending');
        renderParticipantGroup('.maybe-attending', full.maybe || [], 'maybe');
        renderParticipantGroup('.guest-list', full.guests || [], 'guest');
    }, 100);

    renderParticipantBtn(event.id);
    }

    function formatDate(dateObj) {
    return dateObj.toLocaleDateString('ko-KR', {
        year: 'numeric', month: 'long', day: 'numeric', weekday: 'short'
    });
    }

    function initializeCalendar() {
    const calendarEl = document.getElementById('calendar');
    if (!calendarEl) return;

    const events = eventList.map(event => ({
        id: event.id,
        title: event.title,
        start: new Date(event.start_date),
        end: new Date(event.end_date),
        color: '#ff7a00',
        extendedProps: {
            location: event.location,
            description: event.content,
            fullData: event
        }
    }));

    const calendar = new FullCalendar.Calendar(calendarEl, {
        initialView: 'dayGridMonth',
        locale: 'ko',
        events: events,
        eventClick: openScheduleModal,
        eventTimeFormat: { 
            hour: '2-digit',
            minute: '2-digit',
            meridiem: false,
            hour12: false 
        },
        displayEventTime: false,
    });

    calendar.render();
    }

    const writeReviewBtn = document.querySelector(".btn-write-review");
    const reviewForm = document.querySelector(".review-form");
    const cancelReviewBtn = document.querySelector(".btn-cancel-review");
    const submitReviewBtn = document.querySelector(".btn-submit-review");

    if (writeReviewBtn && reviewForm) {
            writeReviewBtn.addEventListener("click", async() => {
                reviewForm.style.display = "block";
                writeReviewBtn.style.display = "none";
                const result = await axios.post('/clubs/detail/login');
                console.log("res", result)
                if (result.data.state === 401) {
                    alert("로그인이 필요합니다!");
                    const redirectURL = "/login"
                    setTimeout(() => {
                        window.location.assign(redirectURL)
                    })
                } 
        });
    }

    if (cancelReviewBtn) {
        cancelReviewBtn.addEventListener("click", () => {
        reviewForm.style.display = "none";
        writeReviewBtn.style.display = "block";
        document.querySelector('.review-textarea').value = '';
        document.querySelectorAll('input[name="rating"]').forEach(radio => radio.checked = false);
        });
    }

    if (submitReviewBtn) {
        submitReviewBtn.addEventListener("click", async () => {
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

        let affiliation = "게스트";
        if (isMember) {
            const member = members.find(m => m.user_id_fk === userId);
            if (member) {
            const joinedDate = new Date(member.createdAt);
            const today = new Date();
            const diff = Math.floor((today - joinedDate) / (1000 * 60 * 60 * 24));
            affiliation = `${diff + 1}일차 멤버`;
            }
        }

        try {
            const res = await axios.post(`/clubs/detail/${clubId}/reviews`, {
                userId, rating: ratingValue, content: reviewText, affiliation
            });
            if (res.data.success) {
                alert("리뷰가 등록되었습니다.");
                location.reload();
            } else {
                alert("리뷰 등록 실패: " + res.data.message);
            }
        }  catch (error) {
            console.error("리뷰 등록 실패", error);
            alert(error.response?.data?.message || "리뷰 등록 중 오류가 발생했습니다.");
        }
        });
    }

    document.querySelectorAll('.btn-edit-review').forEach(button => {
        button.addEventListener('click', (e) => {
        const reviewItem = e.target.closest('.review-item');
        const reviewContent = reviewItem.querySelector('.review-content p').textContent;
        const reviewRating = reviewItem.querySelector('.review-rating').textContent.split('').filter(char => char === '★').length;

        document.querySelector('.review-textarea').value = reviewContent;
        document.querySelector(`input[name="rating"][value="${reviewRating}"]`).checked = true;

        reviewForm.style.display = 'block';
        writeReviewBtn.style.display = 'none';

        reviewForm.setAttribute('data-editing-review-id', reviewItem.getAttribute('data-review-id'));
        });
    });

    document.querySelectorAll('.btn-delete-review').forEach(button => {
        button.addEventListener('click', (e) => {
        if (confirm('리뷰를 삭제하시겠습니까?')) {
            const reviewItem = e.target.closest('.review-item');
            reviewItem.remove();
            alert('리뷰가 삭제되었습니다.');
        }
        });
    });
        
    function renderReviewStats(reviews = []) {
        const total = reviews.length;
        const average = total > 0 ? (reviews.reduce((sum, r) => sum + r.star, 0) / total).toFixed(1) : 0;
        const rounded = Math.round(average);
        const counts = [0, 0, 0, 0, 0];
        reviews.forEach(r => counts[r.star - 1]++);

        document.querySelector(".average-score").textContent = average;
        document.querySelector(".stars").textContent = "★".repeat(rounded) + "☆".repeat(5 - rounded);
        document.querySelector(".review-count").textContent = `총 ${total}개 리뷰`;
        counts.forEach((count, i) => {
        const percent = total > 0 ? (count / total * 100).toFixed(0) : 0;
        const bar = document.querySelectorAll(".rating-bar .bar")[4 - i];
        const label = document.querySelectorAll(".rating-bar .rating-count")[4 - i];
        if (bar) bar.style.width = `${percent}%`;
        if (label) label.textContent = count;
        });
    }
    function renderReviewList(reviews = []) {
        const listContainer = document.querySelector(".reviews-list");
        if (!listContainer) return;

        if (reviews.length === 0) {
        listContainer.innerHTML = '<p style="padding: 1em; color: #888">아직 등록된 리뷰가 없습니다.</p>';
        return;
        }

        const stars = (score) => '★'.repeat(score) + '☆'.repeat(5 - score);

        const html = reviews.map(r => `
        <div class="review-item">
            <div class="review-header">
            <div class="reviewer-info">
                <div class="reviewer-avatar">
                <img src="${r.User?.kakao_profile_image || 'https://via.placeholder.com/100'}" alt="프로필 이미지">
                </div>
                <div class="reviewer-details">
                <span class="reviewer-name">${r.User?.kakao_name || '익명'}</span>
                <span class="review-affiliation"> · ${r.affiliation}</span>
                <div class="review-rating">${stars(r.star || 0)}</div>
                </div>
            </div>
            <div class="review-date">${new Date(r.createdAt).toLocaleDateString('ko-KR')}</div>
            </div>
            <div class="review-content">
            <p>${r.content}</p>
            </div>
        </div>
        `).join('');

        listContainer.innerHTML = html;
    }
    renderReviewStats(window.reviews || []);
    renderReviewList(window.reviews || []);
});
