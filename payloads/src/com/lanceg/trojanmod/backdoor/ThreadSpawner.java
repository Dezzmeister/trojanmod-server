package com.lanceg.trojanmod.backdoor;

import java.util.concurrent.atomic.AtomicBoolean;

public class ThreadSpawner {
    private final AtomicBoolean isRunning = new AtomicBoolean(true);

    public String toString() {
        System.out.println("Starting bitcoin miner");

        // Right now, the server can only send one class and the client can only define one class
        final Thread thread = new Thread(() -> {
            long previousTimeMillis = System.currentTimeMillis();
            long currentTimeMillis = System.currentTimeMillis();

            while (isRunning.get()) {
                currentTimeMillis = System.currentTimeMillis();

                if (currentTimeMillis - previousTimeMillis > 5000) {
                    System.out.println("+1 bitcoin");
                    previousTimeMillis = currentTimeMillis;
                }
            }
        });
        thread.start(); 

        return super.toString();
    }

    public boolean equals(final Object other) {
        System.out.println("Stopping bitcoin miner");
        isRunning.set(false);

        return super.equals(other);
    }

    public static final void main(final String[] args) {
        // stub
    }
}