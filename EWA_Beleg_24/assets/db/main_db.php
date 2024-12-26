<?php 
    include 'conn.php';

    if($request_data->action=="getAll"){
        
        $query= "SELECT * FROM gift_shop";
        $statement=$connect->prepare($query);
        $res = $statement->execute();
        
        
        if($res){
            $rowCount = $statement->rowCount();
            if ($rowCount > 0) {
                $data = array();
                while($row=$statement->fetch(PDO::FETCH_ASSOC)){
                    $data[]=$row;
                }
                echo json_encode($data);
            }else{
                $message = FALSE;
                $output=array("mainGiftShopMsg"=>$message);
                echo json_encode($output);
            }
        }else{
            $message = FALSE;
            $output=array("mainGiftShopMsg"=>$message);
            echo json_encode($output);
        }
    }
?>