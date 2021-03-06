// default duration used for notifications already on DOM when the page is loaded
const NOTIFICATION_DURATION = 6000; // in milliseconds (0 for infinite duration)
const NOTIFICATION_SPEED = 300;

export default class {

    // initialized on page load
    static init() {
        domInit();
        registerEvents();
    }

    // create a notification 'manually'
    static create(message = '', {

            // options defaults
            classes = [],
            position = 'left',
            width = 'auto',
            transitions = ['slide', 'fade'],
            duration = NOTIFICATION_DURATION,
            speed = NOTIFICATION_SPEED,
            dismissOnClick = true,
        } = {}) {


        // global notification setup
        // =========================

        let newNotification = document.createElement('div');
        newNotification.innerHTML = message;
        newNotification.classList.add('notification');


        // options setup
        // =============

        // position
        newNotification.classList.add(`--position-${position}`);

        // transitions
        if (transitions) {
            transitions.forEach(function(transition) {
                newNotification.classList.add(`--transition-${transition}`);
            });
        }

        // dismissOnClick
        if (dismissOnClick) {
            newNotification.classList.add('dismiss');
        }

        // custom classes
        [...classes].forEach(function(className) {
            newNotification.classList.add(className);
        });

        // transition speed
        if (speed) {
            newNotification.style.transitionDuration = getCssDuration(speed);
        }

        // notification duration
        if(duration) {
            setDuration(newNotification, duration);
        }

        // width (available options: "auto")
        if (width === 'auto') {
            newNotification.classList.add('--width-auto');
        }

        // add notification to view
        // ========================

        addToDom(newNotification);
    }
}

function domInit() {

    // create a notifications container
    let notificationsContainer = document.createElement('div');
    notificationsContainer.classList.add('notifications');

    // ...and append it on DOM
    document.querySelector('body').appendChild(notificationsContainer);

    // manage notifications already on DOM after page load
    createFromDom();
}

function createFromDom() {
    let notifications = document.querySelectorAll('.notification');
    [...notifications].forEach(
        (notification) => {
            addToDom(notification);
            setDuration(notification);
        });
}

function registerEvents() {

    // listen to a click event
    // as 'body' is the actual target, it will also work for notifications added after page initialization
    document.querySelector('body').addEventListener('click', function(e) {
        let trigger = e.target;

        let closestNotification = trigger.closest('.notification');
        let dismissibleNotification = closestNotification ? closestNotification.classList.contains('dismiss') : false;
        let dismissTrigger = trigger.classList.contains('dismiss') && trigger.closest('.notification');


        // close the notification
        // ======================

        // dismiss button has to be nested inside the notification
        if(dismissibleNotification || dismissTrigger) {
            let notification = trigger.closest('.notification');
            removeFromDom(notification);
        }
    });
}

function removeFromDom(notification) {

    // hide animation
    notification.classList.remove('is-visible');

    // if notification has a transition, wait for the transition to end before removing from DOM
    if (hasTransition(notification)) {
        notification.addEventListener('transitionend', remove);
    } else {
        remove();
    }

    // executed after animation transition
    function remove() {

        // remove notification from DOM
        notification.parentNode.removeChild(notification);

        // detach event
        notification.removeEventListener('transitionend', remove)
    }
}

function addToDom(notification) {

    // add notification to notifications container (created in 'domInit' function)
    let notificationsContainer = document.querySelector('.notifications');
    notificationsContainer.appendChild(notification);

    // display notification (with a small delay if it has a transition to allow animation to kick off)
    if (hasTransition(notification)) {
        setTimeout(function() {
            notification.classList.add('is-visible');
        }, 10);
    } else {
        notification.classList.add('is-visible');
    }
}

// notification will be removed after some duration (unless duration is set to '0')
function setDuration(notification, duration = NOTIFICATION_DURATION) {

    // set notification stickiness if need be
    if (notification.classList.contains('--sticky')) {
        duration = 0;
    }

    if (duration) {
        setTimeout(function() {
            removeFromDom(notification)
        }, duration);
    }
}

// convert milliseconds into css duration property (eg. 300 => .3s)
function getCssDuration(milliseconds) {
    return (milliseconds / 1000 + 's');
}

function hasTransition(notification) {
    return notification.classList.value.includes('--transition');
}
