<?php
// Файлы phpmailer
require 'phpmailer/PHPMailer.php';
require 'phpmailer/SMTP.php';
require 'phpmailer/Exception.php';
$title = 'Заказ с сайта';
$json = $_POST["Order"];
$arr = json_decode($json, true);


foreach ($arr as $key => $value) {

  $id = $value['id'];
  $name = $value['name'];
  $image = $value['image'];
  $price = $value['price'];
  $quantity = $value['quantity'];
  $order .= "
    <tr>
      <td style='padding: 10px; border: #e9e9e9 1px solid;'>Наименование:<b>$name</b></td>
      <td style='padding: 10px; border: #e9e9e9 1px solid;'>Цена:$price</td>
      <td style='padding: 10px; border: #e9e9e9 1px solid;'>Колличество:$quantity</td>
    </tr>
  ";
}

// Формирование самого письма
foreach ( $_POST as $key => $value ) {
  if ( $value != "" && $key != "Order") {
    $body .= "
    " . ( ($c = !$c) ? '<tr>':'<tr style="background-color: #f8f8f8;">' ) . "
      <td style='padding: 10px; border: #e9e9e9 1px solid;'><b>$key</b></td>
      <td style='padding: 10px; border: #e9e9e9 1px solid;'>$value</td>
    </tr>
    ";
  }
}

$body = "<table style='width: 100%;'>$body . $order</table>";

// Настройки PHPMailer
$mail = new PHPMailer\PHPMailer\PHPMailer(true);

try {
  $mail->isSMTP();
  $mail->CharSet = "UTF-8";
  $mail->SMTPAuth   = true;

  // Настройки вашей почты
  $mail->Host       = 'smtp.gmail.com'; // SMTP сервера вашей почты
  $mail->Username   = 'nikki.ice.promo@gmail.com'; // Логин на почте
  $mail->Password   = 'akuywyvuhirltvgk'; // Пароль на почте
  $mail->SMTPSecure = 'ssl';
  $mail->Port       = 465;
  

  $mail->setFrom('nikki.ice.promo@gmail.com', 'Заявка с вашего сайта'); // Адрес самой почты и имя отправителя

  // Получатель письма
  $mail->addAddress('nikki.ice.promo@gmail.com');

  

  // Отправка сообщения
  $mail->isHTML(true);
  $mail->Subject = $title;
  $mail->Body = $body;

  $mail->send();

} catch (Exception $e) {
  $status = "Сообщение не было отправлено. Причина ошибки: {$mail->ErrorInfo}";
}