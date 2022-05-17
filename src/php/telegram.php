
<?php

/* https://api.telegram.org/botXXXXXXXXXXXXXXXXXXXXX/getUpdates,
где, XXXXXXXXXXXXXXXXXXXXXXX - токен вашего бота, полученный ранее */
$token = "5370025588:AAFWN0MWNVWXGLlfR4gwGmaVY9LHLaKj3Pw";
$chat_id = "-1001608540505";
$title = 'Заказ с сайта';
$json = $_POST["Order"];
$arr = json_decode($json, true);


foreach ($arr as $key => $value) {

  $id = $value['id'];
  $name = $value['name'];
  $image = $value['image'];
  $price = $value['price'];
  $quantity = $value['quantity'];
  $order .= "<b>$name</b>" ."%0a" . "Цена:$price" . "%0a" . "Колличество:$quantity" . "%0a";
  $order .= "%0a";
}

// Формирование самого письма
foreach ( $_POST as $key => $value ) {
  if ( $value != "" && $key != "Order") {
    $body .= "<b>$key</b> :$value %0a";
  }
}

$body = $body . "%0a" . $order;

$sendToTelegram = fopen("https://api.telegram.org/bot{$token}/sendMessage?chat_id={$chat_id}&parse_mode=html&text={$body}","r");


if ($sendToTelegram) {
  echo "Ok";
} else {
  echo "Error";
}
?>