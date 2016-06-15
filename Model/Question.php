<?php

/**
 * Created by PhpStorm.
 * User: FlorentMagnoux
 * Date: 09/06/2016
 * Time: 11:18
 */
class Question extends SQL implements JsonSerializable
{

    private $iQuestionId;
    private $sQuestionLibel;
    private $dQuestionDate;
    private $bQuestionActive;
    private $bQuestionClose;
    private $oUsr;
    private $oSub;
    private $table = "Question";

    private static $active = 1;

    /**
     * @return mixed
     */
    public function getIQuestionId()
    {
        return $this->iQuestionId;
    }

    /**
     * @param mixed $iQuestionId
     * @return Question
     */
    public function setIQuestionId($iQuestionId)
    {
        $this->iQuestionId = $iQuestionId;
        return $this;
    }

    /**
     * @return mixed
     */
    public function getSQuestionLibel()
    {
        return $this->sQuestionLibel;
    }

    /**
     * @param mixed $sQuestionLibel
     * @return Question
     */
    public function setSQuestionLibel($sQuestionLibel)
    {
        $this->sQuestionLibel = $sQuestionLibel;
        return $this;
    }

    /**
     * @return mixed
     */
    public function getDQuestionDate()
    {
        return $this->dQuestionDate;
    }

    /**
     * @param mixed $dQuestionDate
     * @return Question
     */
    public function setDQuestionDate($dQuestionDate)
    {
        $this->dQuestionDate = $dQuestionDate;
        return $this;
    }

    /**
     * @return mixed
     */
    public function getBQuestionActive()
    {
        return $this->bQuestionActive;
    }

    /**
     * @param mixed $bQuestionActive
     * @return Question
     */
    public function setBQuestionActive($bQuestionActive)
    {
        $this->bQuestionActive = $bQuestionActive;
        return $this;
    }

    /**
     * @return mixed
     */
    public function getBQuestionClose()
    {
        return $this->bQuestionClose;
    }

    /**
     * @param mixed $bQuestionClose
     * @return Question
     */
    public function setBQuestionClose($bQuestionClose)
    {
        $this->bQuestionClose = $bQuestionClose;
        return $this;
    }

    /**
     * @return mixed
     */
    public function getOUsr()
    {
        return $this->oUsr;
    }

    /**
     * @param mixed $oUsr
     * @return Question
     */
    public function setOUsr($oUsr)
    {
        $this->oUsr = $oUsr;
        return $this;
    }

    /**
     * @return mixed
     */
    public function getOSub()
    {
        return $this->oSub;
    }

    /**
     * @param mixed $oSub
     * @return Question
     */
    public function setOSub($oSub)
    {
        $this->oSub = $oSub;
        return $this;
    }

    /**
     * @return string
     */
    public function getTable()
    {
        return $this->table;
    }

    /**
     * @param string $table
     * @return Question
     */
    public function setTable($table)
    {
        $this->table = $table;
        return $this;
    }
    /**
     * @return mixed
     */


    public function closeQuestion(){
        $requete = $this->db->prepare('update Question set question_close = :question_close where question_id = :question_id') ;
        return $requete->execute (array(
            ':question_close'=>$this->getBQuestionClose(),
            ':question_id'=>$this->getIQuestionId(),
        ));
    }

    public function getQuestion(){
        $requete = $this->db->prepare('
        select 
            question_id ,
            question_libel ,
            question_date ,
            question_close ,
            usr_id ,
            sub_id
        from Question
        where
            question_active = :question_active
        and 
            question_id = :question_id
         ') ;
        $requete->execute (array(
            ':question_id'=>$this->getIQuestionId(),
            ':question_active'=>self::$active
        ));
        $results = $requete->fetchAll();
        if(empty($results)){
            return false;
        }
        else {
            foreach ($results as $result){
                $oQuestion = new Question();

                $oQuestion->setIQuestionId($result['question_id']);
                $oQuestion->setSQuestionLibel($result['question_libel']);
                $oQuestion->setDQuestionDate(new DateTime($result['question_date']));
                $oQuestion->setBQuestionClose($result['question_close']);
                $oQuestion->setOUsr($result['usr_id']);
                $oQuestion->setOSub($result['sub_id']);
                return $oQuestion;
            }
        }
    }

    public function checkChangeQuestion(){
        $requete = $this->db->prepare('select question_libel from Question where question_id = :question_id') ;
        $requete->execute (array(
            ':question_id'=>$this->getIQuestionId(),
        ));
        $results = $requete->fetchAll();
        if(empty($results)){
            return false;
        }
        else {
            foreach ($results as $result){
                return $result['question_libel'];
            }
        }
    }

    public function createQuestion(){
        $bStatutRequete = false;
        $requete = $this->db->prepare('insert into Question (question_libel , question_date , usr_id , zone_id)values(:question_libel , :question_date , :usr_id , :zone_id)') ;
        if ($requete->execute (array(
            ':question_libel'=>$this->getSQuestionLibel(),
            ':question_date'=>$this->getDQuestionDate()->format('Y-m-d H:i:s'),
            ':usr_id'=>$this->getOUsr()->getIUsrId(),
            ':sub_id'=>$this->getOSub()->getISubId(),
        ))){
            $bStatutRequete = true;
            return $this->db->lastInsertId();
        }
        else {
            return $bStatutRequete;
        }
    }
    
    public function desactivateQuestion($id) {
        $query = $this->db->prepare("UPDATE ".$this->table." SET question_active = 0 WHERE question_id = :id");
        return $query->execute(array(
           "id" => $id 
        ));
    }

    /**
     * Liste paginée des questions
     * @param $iMaxItems
     * @param $iCurrentPage
     * @return array<Question>
     */
    public function getPaginatedQuestionList($iMaxItems, $iCurrentPage, $iId = null) {
        $values = null;
        $aConfig = array(
            "columns" => 'question_id, question_libel, question_date, question_active, question_close, '.$this->table.'.usr_id, usr_pseudo, '.$this->table.'.sub_id, sub_libel',
            "table" => $this->table,
            "join" => array(
                array(
                    "table" => "User",
                    "key" => "usr_id",
                    "foreignKey" => "usr_id"
                ),
                array(
                    "table" => "Subdivision",
                    "key" => "sub_id",
                    "foreignKey" => "sub_id"
                )
            )
        );
        if(!empty($iId)) {
            $aConfig["where"] = "usr_id = :id";
            $values = array("id" => $iId);
        }
        return parent::getPaginatedList($iMaxItems, $iCurrentPage, $aConfig, $values);
    }

    /**
     * Convertir un tableau en un objet Question
     * @param $array
     * @return $this
     */
    public function toObject($array) {
        require_once "./Model/User.php";
        require_once "./Model/Subdivision.php";
        return (new Question())
            ->setIQuestionId(isset($array["question_id"]) ? $array["question_id"] : null)
            ->setSQuestionLibel(isset($array["question_libel"]) ? $array["question_libel"] : null)
            ->setDQuestionDate(isset($array["question_date"]) ? $array["question_date"] : null)
            ->setBQuestionActive(isset($array["question_active"]) ? $array["question_active"] : null)
            ->setBQuestionClose(isset($array["question_close"]) ? $array["question_close"] : null)
            ->setoUsr(isset($array["usr_id"]) ? (new User())->toObject($array) : null)
            ->setoSub(isset($array["sub_id"]) ? (new Subdivision())->toObject($array) : null)
        ;
    }

    /**
     * Specify data which should be serialized to JSON
     * @link http://php.net/manual/en/jsonserializable.jsonserialize.php
     * @return mixed data which can be serialized by <b>json_encode</b>,
     * which is a value of any type other than a resource.
     * @since 5.4.0
     */
    function jsonSerialize()
    {
        return [
            'iQuestionId' => $this->iQuestionId,
            'sQuestionLibel' => utf8_encode($this->sQuestionLibel),
            'dQuestionDate' => $this->dQuestionDate,
            'bQuestionActive' => $this->bQuestionActive,
            'bQuestionClose' => $this->bQuestionClose,
            'oUsrId' => $this->oUsr,
            'oSub' => $this->oSub,
        ];
    }
}