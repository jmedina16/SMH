<?php

namespace App\Models;

use DB;

class Help {

    private $_link;
    private $user;

    public function __construct($user) {
        $this->user = $user;
        $this->_link = DB::connection('os_ticket');
    }

    public function getUserTickets($start, $length, $draw, $tz) {
        date_default_timezone_set($tz);
        $count = $this->_link
                ->select($this->_link->raw('SELECT COUNT(*) AS total FROM ( 
                    SELECT ticket.ticket_id,ticket.`number` AS ticketID,ticket.dept_id,ticket.isanswered,val.value AS subject,user.name, user_email.address as email, dept.dept_name,status.state AS status,ticket.source,ticket_data.priority,ticket.created
                    FROM ost_ticket ticket
                    LEFT JOIN ost_ticket_status status ON status.id = ticket.status_id
                    LEFT JOIN ost_user user ON user.id = ticket.user_id
                    LEFT JOIN ost_department dept ON ticket.dept_id=dept.dept_id
                    LEFT JOIN ost_form_entry entry ON ticket.ticket_id = entry.object_id
                    LEFT JOIN ost_form_entry_values val ON entry.id = val.entry_id
                    LEFT JOIN ost_user_email user_email ON user.id = user_email.user_id
                    LEFT JOIN ost_ticket__cdata ticket_data ON ticket.ticket_id = ticket_data.ticket_id
                    WHERE user_email.address = \'' . $this->user . '\'
                    GROUP BY ticket.ticket_id) GROUPS'));
        $total = $count[0]->total;

        $result = $this->_link
                        ->table($this->_link->raw('ost_ticket ticket'))
                        ->select($this->_link->raw('ticket.ticket_id,ticket.`number` AS ticketID,ticket.dept_id,ticket.isanswered,val.value AS subject,user.name, user_email.address as email, dept.dept_name,status.state AS status,ticket.source,ticket_data.priority,ticket.created'))
                        ->leftJoin($this->_link->raw('ost_ticket_status status'), $this->_link->raw('status.id'), '=', $this->_link->raw('ticket.status_id'))
                        ->leftJoin($this->_link->raw('ost_user user'), $this->_link->raw('user.id'), '=', $this->_link->raw('ticket.user_id'))
                        ->leftJoin($this->_link->raw('ost_department dept'), $this->_link->raw('ticket.dept_id'), '=', $this->_link->raw('dept.dept_id'))
                        ->leftJoin($this->_link->raw('ost_form_entry entry'), $this->_link->raw('ticket.ticket_id'), '=', $this->_link->raw('entry.object_id'))
                        ->leftJoin($this->_link->raw('ost_form_entry_values val'), $this->_link->raw('entry.id'), '=', $this->_link->raw('val.entry_id'))
                        ->leftJoin($this->_link->raw('ost_user_email user_email'), $this->_link->raw('user.id'), '=', $this->_link->raw('user_email.user_id'))
                        ->leftJoin($this->_link->raw('ost_ticket__cdata ticket_data'), $this->_link->raw('ticket.ticket_id'), '=', $this->_link->raw('ticket_data.ticket_id'))
                        ->where('user_email.address', '=', $this->user)
                        ->groupBy($this->_link->raw('ticket.ticket_id'))
                        ->orderBy('created', 'desc')
                        ->take($length)->skip($start)->get();

        $output = array(
            "recordsTotal" => intval($total),
            "recordsFiltered" => intval($total),
            "data" => array()
        );

        if (isset($draw)) {
            $output["draw"] = intval($draw);
        }

        foreach ($result as $ticket) {
            $timestamp = strtotime($ticket->created);
            $offset = date('Z') / 3600;
            $date = date('m/d/Y h:i:s A', ($timestamp + ($offset * 3600)));
            $status = ($ticket->status == 'open') ? '<div class="alert alert-success">' . $ticket->status . '</div>' : '<div class="alert alert-danger">' . $ticket->status . '</div>';
            $row = array();
            $row[] = $status;
            $row[] = $ticket->ticketID;
            $row[] = $ticket->subject;
            $row[] = $ticket->dept_name;
            $row[] = $date;

            $output['data'][] = $row;
        }

        return json_encode($output);
    }

}

