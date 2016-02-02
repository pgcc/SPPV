package action;

import controller.Action;
import dao.OntologyDAO;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

public class ReasonOwlAction2 extends Action{

    @Override
    public void execute(HttpServletRequest request, HttpServletResponse response) throws ServletException {
        //OntologyDAO.getInstance().reasonOntology();
    }

}
