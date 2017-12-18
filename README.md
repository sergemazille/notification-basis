# Notification Basis

Simple notifications component

Works on modern browsers only (uses es6 modules and css custom properties)

## Usage

`notification`s are alerting components types.

For example, a notification can be displayed as a feedback when the website user has performed an operation (eg. successful login).

Notifications can be used either after a page load (`.notification`s already on DOM) or triggered manually (eg. after a user has clicked on something)

### Static notifications

The typical use for a static `.notification` is when a user has just been redirected to a new page after some kind of event.

eg. User is welcomed on their profile page after a successful login validation:

`<div class="notification">Welcome on your profile page</div>`

To display a notification on page load, just add the `.notification` class on one of your template's element.
It will 'convert' it to a notification along with all its content, including buttons, links, images, etc.

Options:

To make it dismissible (with a click), just add the `.dismiss` class directly on the notification or on a trigger element inside it.

`<div class="notification dismiss">Click anywhere to dismiss me</div>`

`<div class="notification">Click <span class="dismiss">here</span> to dismiss me</div>`

To make the notification stick, add the `.--sticky` class, it will remove the default duration.

`<div class="notification --sticky">I won't disappear... like ever...</div>`

#### Static notifications: modifiers

A simple block appearing on top of your content being kind of limited, Reveal Basis supplies some useful modifiers.

**position and width (`--position-right`, `--width-auto`):**

**transition - slide (`--transition-slide`):**

**transition - fade (`--transition-fade`):**

### Scripted notifications

The typical use for a scripted `.notification` is to give a direct feedback to the user (without redirection or page reload).

eg. User tried to submit a form but did not fill a required field in.

The notification is triggered via javascript, using the `create` method.

```typescript
<script>
    [... (failed form validation)]


    import Notification from 'notification-basis/dist/notification'

    Notification.create("Please fill in all the required fields");
</script>
```

#### Notification options

The `create` method accepts an option object as an optional second parameter:

```typescript
<script>
    [...]

    notification.create("Please fill in all the required fields", {
        classes: [],
        position: 'left',
        width: 'auto',
        transitions: ['slide', 'fade'],
        duration: 6000,
        speed: 300,
        dismissOnClick: true,
    });
</script>
```

- classes: an array of classes (eg. `classes: ["error", "small"]`)

default: empty array

Just pass the css classes you want for your `notification` (eg. "my-warning-notification").

- position: a string, either 'left' or 'right'

default: "left"

This option is used with `width` and/or `transitions` options.

Used with `width: 'auto'`, the notification will stick on the *`position`* side of the screen (if its content isn't already screen wide).

Used with `transitions: ['slide']`, the notification will appear on screen from the *`position`*-hand side.

- width: a string, either 'full' or 'auto'

default: "auto"

By default a `notification` will be displayed on the entire device screen width ('full').
If this option is set to 'auto', the `notification` with only be as wide as its content.

- transitions: an array of transition modifiers (eg. `transitions: ["slide", "fade", "insert-your-own"]`)

default: ["slide", "fade"]

Those two transitions are set by default because you will likely want them on your typical notification.
You can get rid of them by passing an empty array `transitions: []` or your own custom transition(s).

Reveal Basis ships with a few transition modifiers:

"slide" will make your notification slide in and out of the screen.

"fade" will make it fade in and out.

You totally can combine all the transitions to achieve the effect you want.

To create your own transition, you will have to follow some simple rules:

- its class name has to start with `.--transition-`

- define the 'normal' and the 'is-visible' state

```css
/* my custom transition */
.--transition-custom {
  transform: rotateZ(0deg);
  width: 100%;
}
.--transition-custom.is-visible {
  transform: rotateZ(720deg);
  width: 25%;
}
```

- duration: an int

default: 6000

Duration is set in milliseconds (`1000` equals 1 second) and represents the time the notification will be displayed.

A duration of `0` will keep the notification indefinitely on screen.

- speed: an int

default: 300

Speed is the transition speed. It will have no effect if no transitions are set `transitions: []`.

- dismissOnClick: a boolean

default: true

As its name implies, if dismissOnClick option is passed, the notification will be dismiss when user click on it.

The library add a `dismiss` class on the notification. You can take advantage on this to add custom style to differentiate between dismissible notifications and non-dismissible ones.
