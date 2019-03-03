<!DOCTYPE HTML>  
<html>
<head>
  <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.4.0/css/bootstrap.min.css">

<!-- jQuery library -->
<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js"></script>

<!-- Latest compiled JavaScript -->
<script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.4.0/js/bootstrap.min.js"></script>
<style>
.error {color: #FF0000;}
</style>
</head>
<body style="background-color:black;color:white">  
<center>

<?php
$servername = "localhost";
$username = "adminDB";
$password = "1234";
$dbname = "entrydata";

$conn = new mysqli($servername, $username, $password, $dbname);
// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
} 
?>

<?php
// define variables and set to empty values
$nameErr = $emailErr = $genderErr = $websiteErr = "";
$name = $email = $gender = $comment = $website = "";

if(isset($_POST['submit'])){
  if ($_SERVER["REQUEST_METHOD"] == "POST") {
  if (empty($_POST["name"])) {
    $nameErr = "Name is required";
  } else {
    $name = test_input($_POST["name"]);
    // check if name only contains letters and whitespace
    if (!preg_match("/^[a-zA-Z ]*$/",$name)) {
      $nameErr = "Only letters and white space allowed"; 
    }
  }
  
  if (empty($_POST["email"])) {
    $emailErr = "Email is required";
  } else {
    $email = test_input($_POST["email"]);
    // check if e-mail address is well-formed
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
      $emailErr = "Invalid email format"; 
    }
  }
}



$sql = "INSERT INTO login(fname, email)
        VALUES ('".$_POST["name"]."','".$_POST["email"]."')";
           $result = mysqli_query($conn,$sql);
?>
<h2><p style"font-size:25pt">
<?php echo "Hello ".$name.",\n";?>
Please Select a option from the following:</h2>
</p>
<form action="https://composer-playground.mybluemix.net/test">
    <input type="submit" value="Create Event" class="btn btn-info"/>
</form>
<?php echo "\n\n";?>
<form action="https://composer-playground.mybluemix.net/test">
    <input type="submit" value="Sell Ticket" class="btn btn-info"/>
</form>
<?php echo "\n";?>
<form action="https://composer-playground.mybluemix.net/test">
    <input type="submit" value="Redeam Ticket" class="btn btn-info"/>
</form>
<?php
exit;
}


function test_input($data) {
  $data = trim($data);
  $data = stripslashes($data);
  $data = htmlspecialchars($data);
  return $data;
}
?>



<h2>#Hackslash</h2>
<p><span class="error">* required field</span></p>
<form method="post">  
  Name: <input type="text" name="name" value="<?php echo $name;?>">
  <span class="error">* <?php echo $nameErr;?></span>
  <br><br>
  E-mail: <input type="text" name="email" value="<?php echo $email;?>">
  <span class="error">* <?php echo $emailErr;?></span>
  <br><br>
<input type="submit" name="submit" value="submit" class="btn btn-info">  
</form>

<?php
echo "<h2>Your Input:</h2>";
echo $name;
echo "<br>";
echo $email;
echo "<br>";

?>
</center>
</body>
</html>