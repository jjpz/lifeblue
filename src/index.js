const form = document.querySelector('form');
const questions = Array.from(document.querySelectorAll('.question'));

// set min date to tomorrow for date input
const date = new Date();
const year = date.getFullYear();
let month = date.getMonth() + 1;
let day = date.getDate() + 1;
if (month < 10) {
    month = '0' + month.toString();
}
if (day < 10) {
    day = '0' + day.toString();
}
const minDate = year + '-' + month + '-' + day;
const dateInput = document.querySelector('input[name="date"]');
dateInput.setAttribute('min', minDate);

// set footer year
const footerYear = document.querySelector('.footer-year');
footerYear.innerHTML = year;

// get navigation buttons
const prevButton = document.querySelector('#navigation button.btn-prev');
const nextButton = document.querySelector('#navigation button.btn-next');
const submitButton = document.querySelector('#navigation button.btn-submit');
const startOverButton = document.querySelector('button.btn-restart');
startOverButton.classList.add('hidden');

const progress = document.querySelector('#progress');
const progressBar = progress.querySelector('#progress-bar');
const progressValue = progress.querySelector('#progress-value');

let counter;
let finalData;

let formData = localStorage.getItem('data') ? JSON.parse(localStorage.getItem('data')) : [];

if (formData.length !== 0) {

    counter = formData.length;

    formData.forEach(data => {

        for (let key in data) {

            if (key === 'question' || key === 'type') {
                continue;
            }

            if (data.type === 'radio') {
                let radio = questions[data.question].querySelector(`input[name="frequency"][value="${data.frequency}"]`);
                radio.checked = true;
            } else {
                let input = questions[data.question].querySelector('.form-element');
                input.value = data[key];
            }

        }

    });

} else {

    counter = 0;
    formData = [];

}

// console.log('Local Storage:', formData);

updateProgress = number => {
    if (number === 0) {
        progress.classList.add('hidden');
    } else {
        progress.classList.remove('hidden');
    }
    let progressPercent = ((number - 1) / 10) * 100;
    progressBar.style.width = `${progressPercent}%`;
    progressValue.innerHTML = `${progressPercent}%`;
    progressBar.setAttribute('aria-valuenow', progressPercent);
}

showQuestion = number => {
    questions[number].classList.add('active');

    if (number === 0) {
        prevButton.classList.add('hidden');
        nextButton.textContent = 'Start';
    } else {
        prevButton.classList.remove('hidden');
        nextButton.textContent = 'Next';
    }

    if (number === questions.length - 1) {

        let summaryContent = '';

        formData.forEach(data => {

            for (let key in data) {

                if (key === 'question' || key === 'type') {
                    continue;
                }

                if (data.type === 'radio') {
                    summaryContent += `
                        <section class="summary-section radio-group">
                            <div>${data.question}. Class frequency:</div>
                            <div>
                                <label for="single">
                                    <input type="radio" id="single" name="frequency" value="single" ${data.frequency === 'single' ? 'checked' : ''}>
                                    <span>Single</span>
                                </label>
                            </div>
                            <div>
                                <label for="monthly">
                                    <input type="radio" id="monthly" name="frequency" value="monthly" ${data.frequency === 'monthly' ? 'checked' : ''}>
                                    <span>Monthly Package</span>
                                </label>
                            </div>
                        </section>
                    `;
                }

                if (data.type === 'select') {
                    summaryContent += `
                    <section class="summary-section select-group">
                        <div>${data.question}. Class type:</div>
                        <select id="class" name="class" class="form-element">
                            <option value="">Please select an option</option>
                            <option value="infant" ${data.class === 'infant' ? 'selected' : ''}>Infant Yoga</option>
                            <option value="baby" ${data.class === 'baby' ? 'selected' : ''}>Baby Yoga</option>
                            <option value="kids" ${data.class === 'kids' ? 'selected' : ''}>Kids Yoga</option>
                        </select>
                    </section>
                    `;
                }

                if (data.type === 'date') {
                    summaryContent += `
                    <section class="summary-section">
                        <div>${data.question}. Date:</div>
                        <div><input type="date" id="date" name="date" min="${minDate}" value="${data[key]}" class="form-element"></div>
                    </section>
                    `;
                }

                if (data.type === 'email') {
                    summaryContent += `
                    <section class="summary-section">
                        <div>${data.question}. Email:</div>
                        <div><input type="email" id="email" name="email" value="${data[key]}" class="form-element"></div>
                    </section>
                    `;
                }

                if (data.type === 'tel') {
                    summaryContent += `
                    <section class="summary-section">
                        <div>${data.question}. Phone:</div>
                        <div><input type="tel" id="tel" name="tel" value="${data[key]}" class="form-element"></div>
                    </section>
                    `;
                }

                if (data.type === 'number') {
                    summaryContent += `
                    <section class="summary-section">
                        <div>${data.question}. Child's age:</div>
                        <div><input type="number" id="age" name="age" min="1" max="12" value="${data[key]}" class="form-element"></div>
                    </section>
                    `;
                }

                if (data.type === 'text') {
                    summaryContent += `<section class="summary-section">`;
                    if (key === 'name') summaryContent += `<div>${data.question}. Child's name:</div>`;
                    if (key === 'parent') summaryContent += `<div>${data.question}. Parent's name:</div>`;
                    if (key === 'event') summaryContent += `<div>${data.question}. Event:</div>`;
                    if (key === 'info') summaryContent += `<div>${data.question}. Additional info:</div>`;
                    summaryContent += `<div><input type="text" id="${key}" name="${key}" value="${data[key]}" class="form-element"></div></section>
                    `;
                }

            }

        });

        document.getElementById('summary').innerHTML = `
            <h2>Summary</h2>
            ${summaryContent}
        `;
        
        prevButton.classList.add('hidden');
        nextButton.classList.add('hidden');
        submitButton.classList.remove('hidden');

    } else {

        nextButton.classList.remove('hidden');
        submitButton.classList.add('hidden');

    }

    updateProgress(number);
}

showQuestion(counter);

prevQuestion = number => {
    questions[number].classList.remove('active');
    counter--;
    showQuestion(counter);
}

nextQuestion = number => {
    if (!validateQuestion()) return false;
    questions[number].classList.remove('active');
    counter++;
    showQuestion(counter);
}

prevButton.addEventListener('click', () => {
    prevQuestion(counter);
});

nextButton.addEventListener('click', () => {
    nextQuestion(counter);
});

startOverButton.addEventListener('click', () => {
    localStorage.clear();
    location.reload();
});

submitButton.addEventListener('click', e => {
    e.preventDefault();

    if (!validateSummary()) return false;

    let finalContent = '';

    finalData.forEach(data => {

        for (let key in data) {

            if (key === 'question' || key === 'type') {
                continue;
            }

            if (data.type === 'radio') finalContent += `<section class="summary-section">${data.question}. Class frequency: ${data[key]}</section>`;
            if (data.type === 'select') finalContent += `<section class="summary-section">${data.question}. Class type: ${data[key]}</section>`;
            if (data.type === 'date') finalContent += `<section class="summary-section">${data.question}. Date: ${data[key]}</section>`;
            if (data.type === 'email') finalContent += `<section class="summary-section">${data.question}. Email: ${data[key]}</section>`;
            if (data.type === 'tel') finalContent += `<section class="summary-section">${data.question}. Phone: ${data[key]}</section>`;
            if (data.type === 'number') finalContent += `<section class="summary-section">${data.question}. Child's age: ${data[key]}</section>`;

            if (data.type === 'text') {
                if (key === 'name') finalContent += `<section class="summary-section">${data.question}. Child's name: ${data[key]}</section>`;
                if (key === 'parent') finalContent += `<section class="summary-section">${data.question}. Parent's name: ${data[key]}</section>`;
                if (key === 'event') finalContent += `<section class="summary-section">${data.question}. Event: ${data[key]}</section>`;
                if (key === 'info') finalContent += `<section class="summary-section">${data.question}. Additional info: ${data[key]}</section>`;
            }

        }

    });

    document.getElementById('summary').innerHTML = `
        <h2>Your info has been submitted!</h2>
        ${finalContent}
    `;

    prevButton.classList.add('hidden');
    nextButton.classList.add('hidden');
    submitButton.classList.add('hidden');
    progress.classList.add('hidden');
    startOverButton.classList.remove('hidden');

    localStorage.clear();
});

validateEmail = email => {
    const regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return regex.test(String(email).toLowerCase());
}

validateQuestion = () => {
    let valid = true;
    let currentData = {};

    if (counter !== questions.length - 1) {
        currentData.question = counter;
    }

    let input = questions[counter].querySelector('.form-element');

    if (questions[counter].classList.contains('radio-group')) {

        currentData.type = 'radio';
        let checkRadio = document.querySelector('input[name="frequency"]:checked');

        if (checkRadio != null) {
            currentData.frequency = checkRadio.value;
        } else {
            valid = false;
            alert('Please select an option');
        }

    } else if (questions[counter].classList.contains('select-group')) {

        currentData.type = 'select';
        currentData.class = input.value;

        if (input.value === '') {
            valid = false;
            alert('Please select an option');
        } else {
            currentData.class = input.value;
        }

    } else {

        if (counter !== 0) {
            currentData.type = input.getAttribute('type');

            if (input.value === '') {
                valid = false;
                input.classList.add('error');
                alert('Please fill out this field');
            } else {
                if (currentData.type === 'email') {
                    if (!validateEmail(input.value)) {
                        valid = false;
                        input.classList.add('error');
                        alert('Please enter a valid email');
                    } else {
                        currentData.email = input.value;
                    }
                } else {
                    input.classList.remove('error');
                    currentData[input.name] = input.value;
                }
            }

        }

    }

    if (valid) {
        formData[currentData.question] = currentData;
        localStorage.setItem('data', JSON.stringify(formData));
        // console.log('Form Data:', formData);
    }

    return valid;
}

validateSummary = () => {
    let valid = true;
    let sections = Array.from(questions[counter].querySelectorAll('section.summary-section'));
    finalData = [];
    finalData.push({ question: 0 });

    sections.forEach((section, index) => {

        if (section.classList.contains('radio-group')) {

            let checkRadio = section.querySelector('input[name="frequency"]:checked');

            if (checkRadio != null) {
                finalData.push({
                    question: index + 1,
                    type: 'radio',
                    frequency: checkRadio.value
                });
            } else {
                valid = false;
                alert('Please select an option');
            }

        } else if (section.classList.contains('select-group')) {

            let select = section.querySelector('select');

            if (select.value === '') {
                valid = false;
                alert('Please select an option');
            } else {
                finalData.push({
                    question: index + 1,
                    type: 'select',
                    class: select.value
                });
            }

        } else {

            let input = section.querySelector('.form-element');

            if (input.value === '') {
                valid = false;
                input.classList.add('error');
                alert('Please fill out this field');
            } else {
                if (input.type === 'email') {
                    if (!validateEmail(input.value)) {
                        valid = false;
                        input.classList.add('error');
                        alert('Please enter a valid email');
                    } else {
                        finalData.push({
                            question: index + 1,
                            type: input.getAttribute('type'),
                            [input.name]: input.value
                        });
                    }
                } else {
                    input.classList.remove('error');
                    finalData.push({
                        question: index + 1,
                        type: input.getAttribute('type'),
                        [input.name]: input.value
                    });
                }
            }

        }

    });

    if (valid) {
        localStorage.setItem('data', JSON.stringify(finalData));
        // console.log('Final Data:', JSON.parse(localStorage.getItem('data')));
    }

    return valid;
}
