package fleo.jqm.kiosque;

import android.os.Bundle;
import android.app.Activity;
import android.view.Menu;

public class FleoKioskActivity extends Activity {

	@Override
	protected void onCreate(Bundle savedInstanceState) {
		super.onCreate(savedInstanceState);
		setContentView(R.layout.activity_fleo_kiosk);
	}

	@Override
	public boolean onCreateOptionsMenu(Menu menu) {
		// Inflate the menu; this adds items to the action bar if it is present.
		getMenuInflater().inflate(R.menu.fleo_kiosk, menu);
		return true;
	}

}
