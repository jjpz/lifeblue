const form = document.querySelector('form');
const questions = Array.from(document.querySelectorAll('.question'));

// set min date to tomorrow for date input
const date = new Date();
const year = date.getFullYear();
const month = (date.getMonth() + 1) < 10 ? `0${date.getMonth() + 1}` : date.getMonth() + 1;
const day = (date.getDate() + 1) < 10 ? `0${date.getDate() + 1}` : date.getDate() + 1;
const minDate = `${year}-${month}-${day}`;
const dateInput = document.querySelector('input[name="date"]');
dateInput.setAttribute('min', minDate);

// set footer year
document.querySelector('.footer-year').innerHTML = year;

// get navigation buttons
const startButton = document.querySelector('.btn-start');
const prevButton = document.querySelector('.btn-prev');
const nextButton = document.querySelector('.btn-next');
const submitButton = document.querySelector('.btn-submit');
const startOverButton = document.querySelector('.btn-restart');

// get progress bar elements
const progress = document.querySelector('#progress');
const progressBar = progress.querySelector('#progress-bar');
const progressValue = progress.querySelector('#progress-value');

let counter;
let finalData;

let formData = localStorage.getItem('data') ? JSON.parse(localStorage.getItem('data')) : [];

updateProgress = number => {
    if (number > -1) progress.classList.remove('hidden');
    let progressPercent = (number / 10) * 100;
    progressBar.style.width = `${progressPercent}%`;
    progressValue.innerHTML = `${progressPercent}%`;
    progressBar.setAttribute('aria-valuenow', progressPercent);
}

showSummary = summaryData => {
    let summaryContent = '';

    summaryData.forEach(data => {

        if (data.type === 'radio') {
            summaryContent += `
                <section class="summary-section radio-group">
                    <div>Class frequency:</div>
                    <div>
                        <label for="single">
                            <input type="radio" id="single" name="ffrequency" value="single" ${data.value === 'single' ? 'checked' : ''}>
                            <span>Single</span>
                        </label>
                    </div>
                    <div>
                        <label for="monthly">
                            <input type="radio" id="monthly" name="ffrequency" value="monthly" ${data.value === 'monthly' ? 'checked' : ''}>
                            <span>Monthly</span>
                        </label>
                    </div>
                </section>
            `;
        }

        if (data.type === 'select') {
            summaryContent += `
            <section class="summary-section select-group">
                <div>Class type:</div>
                <select id="class" name="class" class="form-element">
                    <option value="">Please select an option</option>
                    <option value="infant" ${data.value === 'infant' ? 'selected' : ''}>Infant Yoga</option>
                    <option value="baby" ${data.value === 'baby' ? 'selected' : ''}>Baby Yoga</option>
                    <option value="kids" ${data.value === 'kids' ? 'selected' : ''}>Kids Yoga</option>
                </select>
            </section>
            `;
        }

        if (data.type === 'date') {
            summaryContent += `
            <section class="summary-section">
                <div>Date:</div>
                <div><input type="date" id="date" name="date" min="${minDate}" value="${data.value}" class="form-element"></div>
            </section>
            `;
        }

        if (data.type === 'email') {
            summaryContent += `
            <section class="summary-section">
                <div>Email:</div>
                <div><input type="email" id="email" name="email" value="${data.value}" class="form-element"></div>
            </section>
            `;
        }

        if (data.type === 'tel') {
            summaryContent += `
            <section class="summary-section">
                <div>Phone:</div>
                <div><input type="tel" id="tel" name="tel" value="${data.value}" class="form-element"></div>
            </section>
            `;
        }

        if (data.type === 'number') {
            summaryContent += `
            <section class="summary-section">
                <div>Child's age:</div>
                <div><input type="number" id="age" name="age" min="1" max="12" value="${data.value}" class="form-element"></div>
            </section>
            `;
        }

        if (data.type === 'text') {
            summaryContent += `<section class="summary-section">`;
            if (data.name === 'name') summaryContent += `<div>Child's name:</div>`;
            if (data.name === 'parent') summaryContent += `<div>Parent's name:</div>`;
            if (data.name === 'event') summaryContent += `<div>Event:</div>`;
            if (data.name === 'info') summaryContent += `<div>Additional info:</div>`;
            summaryContent += `<div><input type="text" id="${data.name}" name="${data.name}" value="${data.value}" class="form-element"></div></section>
            `;
        }

    });

    document.getElementById('summary').innerHTML = `
        <h2>Summary</h2>
        ${summaryContent}
    `;
}

showQuestion = number => {
    startButton.classList.add('hidden');
    questions[number].classList.add('active');

    if (number === 0) {
        prevButton.classList.add('hidden');
    } else {
        prevButton.classList.remove('hidden');
    }

    nextButton.classList.remove('hidden');

    if (number === questions.length - 1) {

        showSummary(formData);

        prevButton.classList.add('hidden');
        nextButton.classList.add('hidden');
        submitButton.classList.remove('hidden');

    } else {

        nextButton.classList.remove('hidden');
        submitButton.classList.add('hidden');

    }

    updateProgress(number);
}

if (formData.length > 0) {

    startButton.classList.add('hidden');
    counter = formData.length;
    showQuestion(counter);

    formData.forEach(data => {

        if (data.type === 'radio') {
            questions[data.question].querySelector(`[value="${data.value}"]`).checked = true;
        } else {
            questions[data.question].querySelector('.form-element').value = data.value;
        }

    });

} else {

    counter = -1;

}

// console.log('Local Storage:', formData);

showSubmission = (submittedData) => {
    let finalContent = '';

    submittedData.forEach(data => {

        if (data.type === 'radio') finalContent += `<section class="summary-section">Class frequency: ${data.value}</section>`;
        if (data.type === 'select') finalContent += `<section class="summary-section">Class type: ${data.value}</section>`;
        if (data.type === 'date') finalContent += `<section class="summary-section">Date: ${data.value}</section>`;
        if (data.type === 'email') finalContent += `<section class="summary-section">Email: ${data.value}</section>`;
        if (data.type === 'tel') finalContent += `<section class="summary-section">Phone: ${data.value}</section>`;
        if (data.type === 'number') finalContent += `<section class="summary-section">Child's age: ${data.value}</section>`;

        if (data.type === 'text') {
            if (data.name === 'name') finalContent += `<section class="summary-section">Child's name: ${data.value}</section>`;
            if (data.name === 'parent') finalContent += `<section class="summary-section">Parent's name: ${data.value}</section>`;
            if (data.name === 'event') finalContent += `<section class="summary-section">Event: ${data.value}</section>`;
            if (data.name === 'info') finalContent += `<section class="summary-section">Additional info: ${data.value}</section>`;
        }

    });

    document.getElementById('summary').innerHTML = `
        <h2>Your information has been submitted!</h2>
        ${finalContent}
    `;
}

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

startButton.addEventListener('click', () => {
    counter++;
    showQuestion(counter);
});

prevButton.addEventListener('click', () => {
    prevQuestion(counter);
});

nextButton.addEventListener('click', () => {
    nextQuestion(counter);
});

startOverButton.addEventListener('click', () => {
    location.reload();
});

submitButton.addEventListener('click', e => {
    e.preventDefault();

    if (!validateSummary()) return false;

    fetch('submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(finalData)
    })
    .then(response => {
        if (response.ok) {
            showSubmission(finalData);
        } else {
            alert('Something went wrong. Please try again.\nIf the problem persists, please contact us.');
        }
    });

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

    if (counter < questions.length - 1) {
        currentData.question = counter;
    }

    let input = questions[counter].querySelector('.form-element');

    if (questions[counter].classList.contains('radio-group')) {

        currentData.type = 'radio';
        currentData.name = 'frequency';
        let checkRadio = document.querySelector('input[name="frequency"]:checked');

        if (checkRadio != null) {
            currentData.value = checkRadio.value;
        } else {
            valid = false;
            alert('Please select an option');
        }

    } else if (questions[counter].classList.contains('select-group')) {

        currentData.type = 'select';
        currentData.name = 'class';

        if (input.value === '') {
            valid = false;
            alert('Please select an option');
        } else {
            currentData.value = input.value;
        }

    } else {

        currentData.type = input.type;
        currentData.name = input.name;

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
                    currentData.value = input.value;
                }
            } else {
                input.classList.remove('error');
                currentData.value = input.value;
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

    sections.forEach((section, index) => {

        if (section.classList.contains('radio-group')) {

            let checkRadio = section.querySelector('input[name="ffrequency"]:checked');

            if (checkRadio != null) {
                finalData.push({
                    question: index,
                    type: 'radio',
                    name: 'frequency',
                    value: checkRadio.value
                });
            } else {
                valid = false;
                alert('Please fill out all required fields');
            }

        } else if (section.classList.contains('select-group')) {

            let select = section.querySelector('select');

            if (select.value === '') {
                valid = false;
                alert('Please fill out all required fields');
            } else {
                finalData.push({
                    question: index,
                    type: 'select',
                    name: 'class',
                    value: select.value
                });
            }

        } else {

            let input = section.querySelector('.form-element');

            if (input.value === '') {
                valid = false;
                input.classList.add('error');
                alert('Please fill out all required fields');
            } else {
                if (input.type === 'email') {
                    if (!validateEmail(input.value)) {
                        valid = false;
                        input.classList.add('error');
                        alert('Please enter a valid email');
                    } else {
                        finalData.push({
                            question: index,
                            type: input.type,
                            name: input.name,
                            value: input.value
                        });
                    }
                } else {
                    input.classList.remove('error');
                    finalData.push({
                        question: index,
                        type: input.type,
                        name: input.name,
                        value: input.value
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
