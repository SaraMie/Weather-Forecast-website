// hover effect for the auto detect button

auto_detect_btn.onmouseenter = ()=> {
    auto_detect_btn.querySelector('i').classList.remove('bi-geo-alt')
    auto_detect_btn.querySelector('i').classList.add('bi-geo-alt-fill')
}

auto_detect_btn.onmouseleave = ()=> {
    auto_detect_btn.querySelector('i').classList.add('bi-geo-alt')
    auto_detect_btn.querySelector('i').classList.remove('bi-geo-alt-fill')
}

preferences_btn.onmouseenter = ()=> {
    preferences_btn.querySelector('i').classList.remove('bi-gear')
    preferences_btn.querySelector('i').classList.add('bi-gear-fill')
}

preferences_btn.onmouseleave = ()=> {
    preferences_btn.querySelector('i').classList.add('bi-gear')
    preferences_btn.querySelector('i').classList.remove('bi-gear-fill')
}



// modal buttons
pref_modal.querySelectorAll('span').forEach(span => {
    span.onclick = ()=> {
        span.parentElement.querySelector('.selected').classList.remove('selected')
        span.classList.add('selected')
    }
});

pref_modal.querySelectorAll('span').forEach(span => {
    if(span.classList.contains('selected') && !meters.includes(span.getAttribute('value'))) {
        span.classList.remove('selected')
        console.log(span);
    }
});