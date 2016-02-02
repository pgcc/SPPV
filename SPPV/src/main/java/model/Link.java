package model;

public class Link {

    private String name;
    private boolean inferred;
    private Integer source;
    private Integer target;

    public Link(String name, boolean inferred, Integer source, Integer target) {
        this.name = name;
        this.inferred = inferred;
        this.source = source;
        this.target = target;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public boolean getInferred() {
        return inferred;
    }

    public void setInferred(boolean inferred) {
        this.inferred = inferred;
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

}
