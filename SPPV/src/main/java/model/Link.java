package model;

public class Link {

    private String name;
    private boolean inferred;

    public Link(String name, boolean inferred) {
        this.name = name;
        this.inferred = inferred;
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

}
