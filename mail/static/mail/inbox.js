document.addEventListener('DOMContentLoaded', function() {

  // Use buttons to toggle between views
  document.querySelector('#inbox').addEventListener('click', () => load_mailbox('inbox'));
  document.querySelector('#sent').addEventListener('click', () => load_mailbox('sent'));
  document.querySelector('#archived').addEventListener('click', () => load_mailbox('archive'));
  document.querySelector('#compose').addEventListener('click', compose_email);
  document.querySelector('#compose-form').addEventListener('submit', post_mail)


});

function compose_email() {
  // Show compose view and hide other views
  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'block';

  // Clear out composition fields
  document.querySelector('#compose-recipients').value = '';
  document.querySelector('#compose-subject').value = '';
  document.querySelector('#compose-body').value = '';
}

function load_mailbox(mailbox) {
  const emaillist = document.getElementById('emails-view');
  // Show the mailbox and hide other views
  document.querySelector('#compose-view').style.display = 'none';
  document.querySelector('#emails-view').style.display = 'block';

  // Show the mailbox name
  document.querySelector('#emails-view').innerHTML = `<h3>${mailbox.charAt(0).toUpperCase() + mailbox.slice(1)}</h3>`;
  fetch(`/emails/${mailbox}`)
  .then(response => response.json())
  .then(emails => {
    // ... do something else with emails ...
    console.log(emails)
    emails.forEach(mail => {
      const email = document.createElement('div');
      if (mailbox === 'inbox'){ 
        var x  =  mail['recipients'].join().padEnd(20, '-') + mail['subject'].padEnd(10 - mail['recipients'].length, '-')  +  mail['body'] +  '\xa0'.repeat(50 - mail['body'].length) + mail['timestamp'];
        console.log(x)
     }else if(mailbox === 'sent') {
        var x  =   mail['sender']+  '            ' +  mail['subject'] +  '            ' +  mail['body'] + '            ' + mail['timestamp'];
     }else{
      var x  =  'archived' +  '            ' + mail['subject'] + '            ' +  mail['body'] +  '            ' + mail['timestamp'];
     }
      email.innerHTML = x ;
      email.addEventListener('click', function() {
          console.log('This element has been clicked!')
      });
      emaillist.append(email)
    });
});
}


function post_mail(){
  event.preventDefault()
  fetch('/emails', {
    method: 'POST',
    body: JSON.stringify({
        recipients: document.querySelector('#compose-recipients').value,
        subject: document.querySelector('#compose-subject').value,
        body: document.querySelector('#compose-body').value
    })
  })
  .then(response => response.json())
  .then(result => {
      // Print result
      console.log(result);
      load_mailbox('sent')
  })
}
