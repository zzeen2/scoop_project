* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

.page-container {
    display: flex;
    width: 100%;
    margin-top: 60px; /* 헤더 높이에 맞춤 */
}
.main-content {
    margin-left: 200px; /* 사이드바 너비만큼 여백 */
    width: calc(100% - 200px);
    max-width: 1400px;
    height: fit-content;
    padding: 20px;
}
.club-detail-container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 30px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
    border-radius: 8px;
}
.club-header {
    display: flex;
    margin-bottom: 30px;
    gap: 30px;
}
.club-image-container {
    flex: 0 0 40%;
    max-width: 40%;
    height: 300px;
    overflow: hidden;
    border-radius: 8px;
}
.club-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
}
.club-info {
    flex: 1;
    display: flex;
    flex-direction: column;
}
.club-title-section {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 10px;
}
.club-name {
    font-size: 2em;
    color: #333;
    margin: 0;
}
.btn-heart {
    background: none;
    border: none;
    font-size: 1.8em;
    color: #ff4757;
    cursor: pointer;
    padding: 5px;
    transition: transform 0.2s ease;
}
.btn-heart:hover {
    transform: scale(1.2);
}
.btn-heart.active .heart-icon {
    content: "♥";
    font-weight: bold;
}
.club-category {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 15px;
}
.main-category {
    background-color: #ffb402;
    color: #333;
    padding: 6px 12px;
    border-radius: 4px;
    font-size: 0.9em;
    font-weight: 500;
}
.sub-category {
    background-color: #ffd993;
    color: #333;
    padding: 6px 12px;
    border-radius: 4px;
    font-size: 0.9em;
    font-weight: 500;
}
.club-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    margin-bottom: 15px;
}
.tag {
    display: inline-block;
    background-color: #f5f5f5;
    padding: 5px 10px;
    border-radius: 20px;
    font-size: 0.9em;
}
.club-members-count {
    margin-bottom: 15px;
    font-size: 1.1em;
    color: #555;
}
.current {
    font-weight: bold;
    color: #333;
}
.max {
    color: #666;
}
.club-description {
    line-height: 1.6;
    color: #555;
    margin-bottom: 20px;
}
.club-top-actions {
    display: flex;
    gap: 10px;
    margin-top: 20px;
}
.btn {
    padding: 10px 20px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 1em;
    font-weight: 500;
    transition: all 0.2s;
}
.btn-join {
    background-color: #ffb402;
    color: white;
}
.btn-join:hover {
    background-color: #e07000;
}
.btn-guest {
    background-color: #f5f5f5;
    color: #666;
}
.btn-guest:hover {
    background-color: #bbbbbb;
}
.club-tabs {
    display: flex;
    border-bottom: 1px solid #ddd;
    margin-bottom: 20px;
}
.tab-btn {
    padding: 12px 24px;
    background: none;
    border: none;
    border-bottom: 3px solid transparent;
    cursor: pointer;
    font-size: 1.1em;
    font-weight: 500;
    color: #666;
    transition: all 0.2s;
}
.tab-btn:hover {
    color: #ffb402;
}
.tab-btn.active {
    color: #ffb402;
    border-bottom-color: #ffb402;
}
.tab-pane {
    display: none;
    padding: 20px 0;
}
.tab-pane.active {
    display: block;
}
.schedule-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
}
.schedule-filter select {
    padding: 8px;
    border: 1px solid #ddd;
    border-radius: 4px;
}
#calendar {
    min-height: 500px;
    width: 100%;
    background-color: #fff;
    border: 1px solid #eee;
    border-radius: 8px;
    padding: 10px;
    margin-bottom: 20px;
}
.schedule-detail {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
}
.modal-content {
    background-color: white;
    border-radius: 8px;
    max-width: 600px;
    width: 90%;
    max-height: 90vh;
    overflow-y: auto;
}
.modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 15px 20px;
    border-bottom: 1px solid #ddd;
}
.close-modal {
    font-size: 1.5em;
    cursor: pointer;
}
.modal-body {
    padding: 20px;
}
.event-info {
    margin-bottom: 20px;
}
.event-info p {
    margin-bottom: 8px;
    line-height: 1.4;
}
.participation-poll {
    border-top: 1px solid #eee;
    padding-top: 20px;
    margin-bottom: 20px;
}
.poll-options {
    display: flex;
    gap: 10px;
    margin: 15px 0;
}
.poll-btn {
    padding: 8px 16px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-weight: 500;
}
.poll-yes {
    background-color: #4CAF50;
    color: white;
}
.poll-no {
    background-color: #f44336;
    color: white;
}
.poll-maybe {
    background-color: #FF9800;
    color: white;
}
.participants {
    margin-top: 15px;
}
.participant-group {
    margin-bottom: 15px;
}
.participant-group h5 {
    margin-bottom: 8px;
    color: #555;
}
.participant-list {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
}
.participant {
    background-color: #f5f5f5;
    padding: 4px 8px;
    border-radius: 4px;
    font-size: 0.9em;
}
.attending .participant {
    background-color: #e8f5e9;
}
.not-attending .participant {
    background-color: #ffebee;
}
.maybe-attending .participant {
    background-color: #fff3e0;
}
.guest-section {
    border-top: 1px solid #eee;
    padding-top: 20px;
}
.btn-guest-apply {
    margin: 10px 0;
    padding: 8px 16px;
    background-color: #ffb402;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
}
.guest-list {
    margin-top: 15px;
}
.guest-list h5 {
    margin-bottom: 8px;
    color: #555;
}
.guest-item {
    display: flex;
    justify-content: space-between;
    background-color: #f5f5f5;
    padding: 8px 12px;
    border-radius: 4px;
    margin-bottom: 8px;
}
.members-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
}
.member-group {
    margin-bottom: 30px;
}
.member-group h4 {
    margin-bottom: 15px;
    color: #555;
    padding-bottom: 8px;
    border-bottom: 1px solid #eee;
}
.member-cards {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
    gap: 15px;
    margin-bottom: 20px;
}
.member-card {
    display: flex;
    align-items: center;
    background-color: #f8f8f8;
    padding: 15px;
    border-radius: 8px;
    transition: all 0.2s;
}
.member-card:hover {
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    transform: translateY(-2px);
}
.member-avatar {
    width: 60px;
    height: 60px;
    border-radius: 50%;
    overflow: hidden;
    margin-right: 15px;
}
.member-avatar img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}
.member-info {
    flex: 1;
}
.member-name {
    font-weight: 600;
    margin-bottom: 5px;
}
.member-join-date {
    display: block;
    font-size: 0.85em;
    color: #777;
}
.pagination {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 10px;
    margin-top: 20px;
}

.pagination-btn {
    padding: 6px 12px;
    border: 1px solid #ddd;
    background-color: white;
    border-radius: 4px;
    cursor: pointer;
}

.pagination-btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
}

.pagination-page {
    width: 30px;
    height: 30px;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 4px;
    cursor: pointer;
}

.pagination-page.active {
    background-color: #ffb402;
    color: white;
}

/* 리뷰 탭 */
.reviews-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
}

.btn-write-review {
    background-color: #ffb402;
    color: white;
}

.review-stats {
    display: flex;
    gap: 40px;
    margin-bottom: 30px;
    padding: 20px;
    background-color: #f8f8f8;
    border-radius: 8px;
}

.rating-average {
    display: flex;
    flex-direction: column;
    align-items: center;
    min-width: 150px;
}

.average-score {
    font-size: 3em;
    font-weight: bold;
    color: #333;
}

.stars {
    color: #ffb402;
    font-size: 1.5em;
    margin: 5px 0;
}

.review-count {
    color: #666;
}

.rating-bars {
    flex: 1;
}

.rating-bar {
    display: flex;
    align-items: center;
    margin-bottom: 8px;
}

.rating-label {
    min-width: 40px;
    text-align: right;
    margin-right: 10px;
    color: #666;
}

.bar-container {
    flex: 1;
    height: 12px;
    background-color: #ddd;
    border-radius: 10px;
    margin-right: 10px;
    overflow: hidden;
}

.bar {
    height: 100%;
    background-color: #ffb402;
    border-radius: 10px;
}

.rating-count {
    min-width: 30px;
    color: #666;
}

.review-form {
    background-color: #f8f8f8;
    padding: 20px;
    border-radius: 8px;
    margin-bottom: 30px;
}

.review-form h4 {
    margin-bottom: 15px;
    color: #333;
}

.rating-input {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 15px;
}

.star-rating {
    display: flex;
    flex-direction: row-reverse;
    gap: 5px;
}

.star-rating input {
    display: none;
}

.star-rating label {
    font-size: 1.5em;
    color: #ddd;
    cursor: pointer;
}

.star-rating input:checked ~ label {
    color: #ffb402;
}

.star-rating label:hover,
.star-rating label:hover ~ label {
    color: #ffb402;
}

.review-textarea {
    width: 100%;
    min-height: 120px;
    padding: 12px;
    border: 1px solid #ddd;
    border-radius: 4px;
    margin-bottom: 15px;
    resize: vertical;
}

.review-form-actions {
    display: flex;
    justify-content: flex-end;
    gap: 10px;
}

.btn-cancel-review {
    background-color: #f5f5f5;
    color: #666;
}

.btn-submit-review {
    background-color: #ffb402;
    color: white;
}

.reviews-list {
    margin-bottom: 20px;
}

.review-item {
    border-bottom: 1px solid #eee;
    padding: 20px 0;
}

.review-header {
    display: flex;
    justify-content: space-between;
    margin-bottom: 15px;
}

.reviewer-info {
    display: flex;
    align-items: center;
}

.reviewer-avatar {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    overflow: hidden;
    margin-right: 12px;
}

.reviewer-avatar img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.reviewer-name {
    font-weight: 600;
    margin-bottom: 4px;
}

.review-rating {
    color: #ffb402;
}

.review-date {
    color: #888;
    font-size: 0.9em;
}

.review-content {
    line-height: 1.6;
    color: #555;
    margin-bottom: 15px;
}

.review-actions {
    display: flex;
    justify-content: flex-end;
    gap: 10px;
}

.btn-edit-review,
.btn-delete-review {
    background: none;
    border: none;
    color: #666;
    cursor: pointer;
    font-size: 0.9em;
    text-decoration: underline;
}

.btn-edit-review:hover,
.btn-delete-review:hover {
    color: #333;
}

.verifications-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
}

.verification-info {
    background-color: #f8f8f8;
    padding: 15px;
    border-radius: 8px;
    margin-bottom: 25px;
    color: #555;
    line-height: 1.5;
}

.verification-form {
    background-color: #f8f8f8;
    padding: 20px;
    border-radius: 8px;
    margin-bottom: 30px;
}

.verification-form h4 {
    margin-bottom: 15px;
    color: #333;
}

.verification-event-select {
    margin-bottom: 15px;
}

.verification-event-select label {
    display: block;
    margin-bottom: 8px;
    font-weight: 500;
}

.event-select {
    width: 100%;
    padding: 10px;
    border: 1px solid #ddd;
    border-radius: 4px;
}

.verification-upload-container {
    margin-bottom: 20px;
}

.verification-upload-box {
    border: 2px dashed #ddd;
    padding: 30px;
    text-align: center;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.3s;
}

.verification-upload-box:hover {
    border-color: #ffb402;
}

.upload-icon {
    font-size: 2em;
    color: #999;
    margin-bottom: 10px;
}

.verification-preview {
    margin-top: 15px;
    position: relative;
}

.verification-preview img {
    max-width: 100%;
    max-height: 300px;
    border-radius: 8px;
}

.btn-remove-preview {
    position: absolute;
    top: 10px;
    right: 10px;
    background-color: rgba(0, 0, 0, 0.6);
    color: white;
    border: none;
    width: 30px;
    height: 30px;
    border-radius: 50%;
    font-size: 1.2em;
    cursor: pointer;
}

.verification-form-actions {
    display: flex;
    justify-content: flex-end;
    gap: 10px;
}

.verification-gallery {
    margin-top: 30px;
}

.verification-gallery h4 {
    margin-bottom: 15px;
    color: #333;
}

.verification-filters {
    margin-bottom: 20px;
}

.filter-event {
    padding: 8px 12px;
    border: 1px solid #ddd;
    border-radius: 4px;
    min-width: 200px;
}

.verification-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 20px;
    margin-bottom: 30px;
}

.verification-item {
    border-radius: 8px;
    overflow: hidden;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    transition: transform 0.2s;
}

.verification-item:hover {
    transform: translateY(-5px);
}

.verification-image {
    height: 200px;
    overflow: hidden;
}

.verification-image img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.verification-meta {
    padding: 12px;
    background-color: white;
}

.verification-user {
    font-weight: 600;
    margin-bottom: 5px;
}

.verification-date, .verification-event {
    font-size: 0.85em;
    color: #666;
}

.verification-load-more {
    text-align: center;
    margin-top: 20px;
}

.btn-load-more {
    background-color: #f5f5f5;
    color: #666;
    border: none;
    padding: 10px 20px;
    border-radius: 4px;
    cursor: pointer;
    transition: background-color 0.2s;
}

.btn-load-more:hover {
    background-color: #e0e0e0;
}