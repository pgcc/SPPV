package model;

import java.util.ArrayList;

public class Path {

    private Integer source;
    private Integer target;
    private String type;
    private ArrayList<Link> links;

    public Path(Integer source, Integer target) {
        this.source = source;
        this.target = target;
        this.links = new ArrayList<>();
    }
    public Path(Integer source, Integer target, ArrayList<Link> links) {
        this.source = source;
        this.target = target;
        this.links = links;
    }

    public Integer getSource() {
        return source;
    }

    public void setSource(Integer source) {
        this.source = source;
    }

    public Integer getTarget() {
        return target;
    }

    public void setTarget(Integer target) {
        this.target = target;
    }

    public ArrayList<Link> getLinks() {
        return links;
    }

    public void setLinks(ArrayList<Link> links) {
        this.links = links;
    }
    
    public void addLink(Link link){
        this.links.add(link);
    }

    public void assertLink(String name) {
        for(Link link : links){
            if(link.getName().equals(name)){
                link.setInferred(false);
            }
        }
    }
    
    public void checkType(){
        String type = "";
        for(Link link : links){
            if(link.getInferred()){
                if(type.equals("")){
                    type = "inferred";
                }else if(type.equals("asserted")){
                    type = "both";
                    break;
                }                    
            }else{
                if(type.equals("")){
                    type = "asserted";
                }else if(type.equals("inferred")){
                    type = "both";
                    break;
                }
            }
        }
        this.type = type;
    }
}
