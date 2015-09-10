/*
 * LetsLeak
 * An anonymonus social platform
 * Copyright 2014 LetsLeak
 * https://github.com/harshitdaga/letsleak
*/
$('.ui.form')
    .form({
        username: {
            identifier : 'username',
            rules: [
                {
                    type   : 'empty',
                    prompt : 'Please enter a username'
                }
            ]
        },
        password: {
            identifier : 'password',
            rules: [
                {
                    type   : 'empty',
                    prompt : 'Please enter a password'
                },
                {
                    type   : 'length[6]',
                    prompt : 'Your password must be at least 6 characters'
                }
            ]
        },
        emailId : {
            identifier: 'emailId',
            rules: [
                {
                    type   : 'empty',
                    prompt : 'Please enter a email address'
                },
                {
                    type : 'email',
                    prompt: 'Please enter a valid emailId'
                }
            ]
        }

    })
;