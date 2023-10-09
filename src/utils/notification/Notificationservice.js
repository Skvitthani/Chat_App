const sendSingleDiveceNotifiaction = data => {
  var myHeaders = new Headers();
  myHeaders.append('Content-Type', 'application/json');
  myHeaders.append(
    'Authorization',
    'key = AAAAue4rVP0:APA91bGf0zv6nhpok7i6CGzTveihI47qMTevcYKz7WZzVY4RvGOOJ3QkoBHSZGGYYh_r4N9MXi-jKrQiqV1Ru_mIxKrRit5GZ3hdhs__xAxqFLxT91Pj79fA1lqyafCrrb3P51dq-jm-',
  );
  myHeaders.append('apikey', 'YOUR-APIKEY');

  var raw = JSON.stringify({
    data: {
      CallId: data.CallId,
      Photo: data.Photo,
      body: data.body,
      title: data.title,
    },
    to: data.token,
  });

  var requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: raw,
    redirect: 'follow',
  };

  fetch('https://fcm.googleapis.com/fcm/send', requestOptions)
    .then(response => response.text())
    .then(result => console.log(result))
    .catch(error => console.log(error));
};

const sendMultiDiveceNotification = data => {
  var myHeaders = new Headers();
  myHeaders.append('Content-Type', 'application/json');
  myHeaders.append(
    'Authorization',
    'key = AAAAue4rVP0:APA91bGf0zv6nhpok7i6CGzTveihI47qMTevcYKz7WZzVY4RvGOOJ3QkoBHSZGGYYh_r4N9MXi-jKrQiqV1Ru_mIxKrRit5GZ3hdhs__xAxqFLxT91Pj79fA1lqyafCrrb3P51dq-jm-',
  );
  myHeaders.append('apikey', 'YOUR-APIKEY');

  var raw = JSON.stringify({
    data: {
      CallId: data.CallId,
      Photo: data.Photo,
      body: data.body,
      title: data.title,
    },
    registration_ids: data.token,
  });

  var requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: raw,
    redirect: 'follow',
  };

  fetch('https://fcm.googleapis.com/fcm/send', requestOptions)
    .then(response => response.text())
    .then(result => console.log(result))
    .catch(error => console.log(error));
};

const sendFriendRequestNotification = data => {
  var myHeaders = new Headers();
  myHeaders.append('Content-Type', 'application/json');
  myHeaders.append(
    'Authorization',
    'key = AAAAue4rVP0:APA91bGf0zv6nhpok7i6CGzTveihI47qMTevcYKz7WZzVY4RvGOOJ3QkoBHSZGGYYh_r4N9MXi-jKrQiqV1Ru_mIxKrRit5GZ3hdhs__xAxqFLxT91Pj79fA1lqyafCrrb3P51dq-jm-',
  );
  myHeaders.append('apikey', 'YOUR-APIKEY');

  var raw = JSON.stringify({
    data: {
      CallId: data.CallId,
      Photo: data.Photo,
      body: data.body,
      title: data.title,
    },
    to: data.token,
  });

  var requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: raw,
    redirect: 'follow',
  };

  fetch('https://fcm.googleapis.com/fcm/send', requestOptions)
    .then(response => response.text())
    .then(result => console.log(result))
    .catch(error => console.log(error));
};

export default {
  sendMultiDiveceNotification,
  sendSingleDiveceNotifiaction,
  sendFriendRequestNotification,
};
