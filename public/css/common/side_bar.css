a { 
    display: flex;
    align-items: center;
    gap: 10px;
    text-decoration: none;
    color: black;
}

.sidebar {
    position: absolute;
    left: 0;
    top: 60px;
    width: 200px;
    background-color: #ffffff;
    color: rgb(17, 17, 17);
    padding-top: 20px;
    box-shadow: 3px 2px 4px rgba(1, 0, 2, 0.1);
    height: auto; 
    min-height: calc(100% - 60px);
    overflow-y: visible;
}

.sidebar ul {
    list-style: none;
    padding: 0;
}

.sidebar ul li {
    position: relative;
    padding: 15px;
    text-align: center;
}

.sidebar ul li:hover {
    background: linear-gradient(90deg, #e0eddd, #88aae5);
    color: white;
}

.sidebar ul li a {
    color: rgb(17, 17, 17);
    text-decoration: none;
    display: inline-flex;
    align-items: center;
    font-size: 16px;
    position: relative;
    transition: opacity 0.3s ease;
}


.sidebar ul li::after {
    content: "바로가기"; 
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%) scale(0.5);
    opacity: 0;
    font-size: 14px;
    font-weight: bold;
    color: white;
    background: rgba(0, 0, 0, 0.8);
    padding: 6px 10px;
    border-radius: 5px;
    white-space: nowrap;
}


.sidebar ul li:hover a {
    animation: fadeOut 0.3s forwards;
}

.sidebar ul li:hover::after {
    animation: fadeInScale 0.3s forwards;
}

.sidebar ul li img {
    width: 24px;
    height: 24px; 
    display: block;
    margin: 0 auto;
}

.sidebar ul li:hover {
    background-color: #a7b4c0;
    color: white;
}

.sidebar ul li:hover a {
    color: white;
}

@keyframes fadeInScale {
    0% {
        opacity: 0;
        transform: translate(-50%, -50%) scale(0.5);
    }
    100% {
        opacity: 1;
        transform: translate(-50%, -50%) scale(1);
    }
}

@keyframes fadeOut {
    0% {
        opacity: 1;
    }
    100% {
        opacity: 0;
    }
}
